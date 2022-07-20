import { nanoid } from 'nanoid';
import ThebeCell from './cell';
import ThebeSession from './session';
import { ThebeManager } from './manager';
import { MathjaxOptions, ThebeContext } from './types';
import { MessageCallback, MessageCallbackArgs, MessageSubject, NotebookStatus } from './messaging';

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
    messages?: MessageCallback
  ) {
    const id = nanoid();
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
    const cell = this.cells?.find((cell: ThebeCell) => cell.id === id);
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
    // TODO some typeof redux.config hookup for
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

  async executeUpTo(cellId: string, preprocessor?: (s: string) => string) {
    if (!this.cells) return null;
    this.message({
      status: NotebookStatus.executing,
      message: `executeUpTo ${cellId}${preprocessor ? ' with preprocessor' : ''}`,
    });
    const idx = this.cells.findIndex((c) => c.id === cellId);
    if (idx === -1) return null;
    const cellsToExecute = this.cells.slice(0, idx + 1);
    cellsToExecute.map((cell) => cell.messageBusy());
    let result = null;
    for (let cell of cellsToExecute) {
      console.debug(`Executing cell ${cell.id}`);
      result = await cell?.execute(preprocessor ? preprocessor(cell.source) : cell.source);
      if (!result) {
        console.error(`Error executing cell ${cell.id}`);
        this.message({
          status: NotebookStatus.error,
          message: `executeUpTo: Error executing cell ${cell.id}`,
        });
        return null;
      }
    }
    this.message({
      status: NotebookStatus.completed,
      message: `executeUpTo ${cellId}`,
    });
    return result;
  }

  async executeOnly(cellId: string, preprocessor?: (s: string) => string) {
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
    return retval;
  }

  async executeCells(
    cellIds: string[],
    preprocessor?: (s: string) => string
  ): Promise<{
    height: number;
    width: number;
  } | null> {
    if (!this.cells) return null;
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

    let result = null;
    for (let cell of cells) {
      result = await cell.execute(preprocessor ? preprocessor(cell.source) : cell.source);
      if (!result) {
        console.error(`Error executing cell ${cell.id}`);
        this.message({
          status: NotebookStatus.error,
          message: `executeCells: Error executing cell ${cell.id}`,
        });
        return null;
      }
    }
    this.message({
      status: NotebookStatus.completed,
      message: `executeCells ${cellIds.length} cells`,
    });
    return result;
  }

  async executeAll(preprocessor?: (s: string) => string): Promise<{
    height: number;
    width: number;
  } | null> {
    if (!this.cells) return null;
    this.message({
      status: NotebookStatus.executing,
      message: `executeAll${preprocessor ? ' with preprocessor' : ''}`,
    });
    this.cells.map((cell) => cell.messageBusy());
    let result = null;
    for (let cell of this.cells) {
      result = await cell.execute(preprocessor ? preprocessor(cell.source) : cell.source);
      if (!result) {
        console.error(`Error executing cell ${cell.id}`);
        this.message({
          status: NotebookStatus.error,
          message: `executeAll: Error executing cell ${cell.id}`,
        });
        return null;
      }
    }
    this.message({
      status: NotebookStatus.completed,
      message: `executeAll`,
    });
    return result;
  }
}

export default ThebeNotebook;
