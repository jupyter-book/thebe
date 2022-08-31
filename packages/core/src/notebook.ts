import { nanoid } from 'nanoid';
import ThebeCell from './cell';
import type ThebeSession from './session';
import { ThebeManager } from './manager';
import type { MathjaxOptions } from './types';
import type { MessageCallback, MessageCallbackArgs } from './messaging';
import { MessageSubject, NotebookStatus } from './messaging';

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
  id: string;
  cells?: ThebeCell[];
  session?: ThebeSession;
  _messages?: MessageCallback;

  static fromCodeBlocks(
    blocks: CodeBlock[],
    mathjaxOptions: MathjaxOptions,
    messages?: MessageCallback,
    externalId?: string,
  ) {
    const id = externalId ?? nanoid();
    const notebook = new ThebeNotebook(id, messages);
    notebook.cells = blocks.map((c) => {
      const cell = new ThebeCell(c.id, id, c.source, mathjaxOptions);
      console.debug(`thebe:notebook:fromCodeBlocks Initializing cell ${c.id}`);
      return cell;
    });

    notebook.message({
      status: NotebookStatus.changed,
      message: `Created notebook with ${notebook.cells.length} cells`,
    });

    return notebook;
  }

  constructor(id: string, messages?: MessageCallback) {
    this.id = id;
    this._messages = messages;
  }

  message(data: Omit<MessageCallbackArgs, 'id' | 'subject'>) {
    this._messages?.({
      ...data,
      id: this.id,
      subject: MessageSubject.notebook,
    });
  }

  numCells() {
    return this.cells?.length ?? 0;
  }

  getCell(idx: number) {
    if (!this.cells) throw Error('Dag not initialized');
    if (idx >= this.cells.length)
      throw Error(`Notebook.cells index out of range: ${idx}:${this.cells.length}`);
    return this.cells[idx];
  }

  getCellById(id: string) {
    const cell = this.cells?.find((c: ThebeCell) => c.id === id);
    return cell;
  }

  lastCell() {
    if (!this.cells) throw Error('Notebook not initialized');
    return this.cells[this.cells.length - 1];
  }

  async waitForKernel(kernel: Promise<ThebeSession>) {
    return kernel.then((k) => {
      this.attachSession(k);
      return k;
    });
  }

  attachSession(session: ThebeSession) {
    if (!session.kernel) return;
    const cdnOnly = true;
    const manager = new ThebeManager(session.kernel, cdnOnly);
    this.cells?.map((cell) => cell.attachSession(session, manager));
    this.message({
      status: NotebookStatus.changed,
      message: 'Attached to session',
    });
  }

  detachSession() {
    this.cells?.map((cell) => cell.detachSession());
    this.message({
      status: NotebookStatus.changed,
      message: 'Detached from session',
    });
  }

  async executeUpTo(
    cellId: string,
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this.cells) return [];
    this.message({
      status: NotebookStatus.executing,
      message: `executeUpTo ${cellId}${preprocessor ? ' with preprocessor' : ''}`,
    });
    const idx = this.cells.findIndex((c) => c.id === cellId);
    if (idx === -1) return [];
    const cellsToExecute = this.cells.slice(0, idx + 1);
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
    if (!this.cells) return null;
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
    if (!this.cells) return [];
    this.message({
      status: NotebookStatus.executing,
      message: `executeCells ${cellIds.length} cells${preprocessor ? ' with preprocessor' : ''}`,
    });
    const cells = this.cells.filter((c) => {
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
    if (!this.cells) return [];

    this.message({
      status: NotebookStatus.executing,
      message: `executeAll${preprocessor ? ' with preprocessor' : ''}`,
    });

    this.cells.map((cell) => cell.messageBusy());

    const result = this.executeCells(this.cells.map((c) => c.id));

    this.message({
      status: NotebookStatus.completed,
      message: `executeAll`,
    });

    return result;
  }
}

export default ThebeNotebook;
