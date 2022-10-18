import ThebeCell from './cell';
import type ThebeSession from './session';
import type { MathjaxOptions } from './types';
import type { MessageCallback, MessageCallbackArgs } from './messaging';
import { MessageSubject, NotebookStatus } from './messaging';
import { shortId } from './utils';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { getRenderMimeRegistry } from './rendermime';

interface ExecuteReturn {
  id: string;
  height: number;
  width: number;
}

export interface CodeBlock {
  id: string;
  source: string;
  [x: string]: any;
}

class ThebeNotebook {
  _id: string;
  _rendermime: IRenderMimeRegistry;
  _cells: ThebeCell[];
  _session?: ThebeSession;
  _messages?: MessageCallback;

  constructor(id: string, messages?: MessageCallback) {
    this._id = id;
    this._cells = [];
    this._rendermime = getRenderMimeRegistry();
    this._messages = messages;
  }

  get rendermime() {
    return this._rendermime;
  }

  get session() {
    return this._session;
  }

  get cells() {
    return this._cells;
  }

  static fromCodeBlocks(
    blocks: CodeBlock[],
    mathjaxOptions: MathjaxOptions,
    messages?: MessageCallback,
    externalId?: string,
  ) {
    const id = externalId ?? shortId();
    const notebook = new ThebeNotebook(id, messages);
    notebook._cells = blocks.map((c) => {
      const cell = new ThebeCell(c.id, id, c.source, notebook.rendermime, mathjaxOptions);
      console.debug(`thebe:notebook:fromCodeBlocks Initializing cell ${c.id}`);
      return cell;
    });

    notebook.message({
      status: NotebookStatus.changed,
      message: `Created notebook with ${notebook._cells.length} cells`,
    });

    return notebook;
  }

  message(data: Omit<MessageCallbackArgs, 'id' | 'subject' | 'object'>) {
    this._messages?.({
      ...data,
      id: this._id,
      subject: MessageSubject.notebook,
      object: this,
    });
  }

  numCells() {
    return this._cells?.length ?? 0;
  }

  getCell(idx: number) {
    if (!this._cells) throw Error('Dag not initialized');
    if (idx >= this._cells.length)
      throw Error(`Notebook.cells index out of range: ${idx}:${this._cells.length}`);
    return this._cells[idx];
  }

  getCellById(id: string) {
    const cell = this._cells?.find((c: ThebeCell) => c.id === id);
    return cell;
  }

  lastCell() {
    if (!this._cells) throw Error('Notebook not initialized');
    return this._cells[this._cells.length - 1];
  }

  async waitForKernel(kernel: Promise<ThebeSession>) {
    return kernel.then((k) => {
      this.attachSession(k);
      return k;
    });
  }

  attachSession(session: ThebeSession) {
    if (!session.kernel) throw Error('ThebeNotebook - cannot connect to session, no kernel');
    // note all cells in a notebook share the rendermime registry
    // we only need to add the widgets factory once
    this._session = session;
    session.manager.addWidgetFactories(this._rendermime);
    this._cells?.forEach((cell) => (cell.session = session));
    this.message({
      status: NotebookStatus.changed,
      message: 'Attached to session',
    });
  }

  detachSession() {
    this._session?.manager.removeWidgetFactories(this._rendermime);
    this._cells?.map((cell) => (cell.session = undefined));
    this._session = undefined;
    this.message({
      status: NotebookStatus.changed,
      message: 'Detached from session',
    });
  }

  async executeUpTo(
    cellId: string,
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this._cells) return [];
    this.message({
      status: NotebookStatus.executing,
      message: `executeUpTo ${cellId}${preprocessor ? ' with preprocessor' : ''}`,
    });
    const idx = this._cells.findIndex((c) => c.id === cellId);
    if (idx === -1) return [];
    const cellsToExecute = this._cells.slice(0, idx + 1);
    cellsToExecute.map((cell) => cell.messageBusy());
    const result = this.executeCells(cellsToExecute.map((c) => c.id));
    this.message({
      status: NotebookStatus.completed,
      message: `executeUpTo ${cellId}`,
    });
    return result;
  }

  async executeOnly(
    cellId: string,
    preprocessor?: (s: string) => string,
  ): Promise<ExecuteReturn | null> {
    if (!this._cells) return null;
    this.message({
      status: NotebookStatus.executing,
      message: `executeOnly ${cellId}${preprocessor ? ' with preprocessor' : ''}`,
    });

    const retval = await this.executeCells([cellId], preprocessor);

    this.message({
      status: NotebookStatus.completed,
      message: `executeOnly ${cellId}`,
    });
    return retval[0];
  }

  async executeCells(
    cellIds: string[],
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this._cells) return [];
    this.message({
      status: NotebookStatus.executing,
      message: `executeCells ${cellIds.length} cells${preprocessor ? ' with preprocessor' : ''}`,
    });
    const cells = this._cells.filter((c) => {
      const found = cellIds.find((id) => id === c.id);
      if (!found) {
        console.warn(`Cell ${c.id} not found in notebook`);
      }
      return Boolean(found);
    });

    const result = Promise.all(
      cells.map((cell) => cell.execute(preprocessor ? preprocessor(cell.source) : cell.source)),
    );

    this.message({
      status: NotebookStatus.completed,
      message: `executeCells ${cellIds.length} cells`,
    });
    return result;
  }

  async executeAll(preprocessor?: (s: string) => string): Promise<(ExecuteReturn | null)[]> {
    if (!this._cells) return [];

    this.message({
      status: NotebookStatus.executing,
      message: `executeAll${preprocessor ? ' with preprocessor' : ''}`,
    });

    this._cells.map((cell) => cell.messageBusy());

    const result = this.executeCells(this._cells.map((c) => c.id));

    this.message({
      status: NotebookStatus.completed,
      message: `executeAll`,
    });

    return result;
  }
}

export default ThebeNotebook;
