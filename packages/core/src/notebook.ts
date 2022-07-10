import { nanoid } from 'nanoid';
import ThebeCell from './cell';
import ThebeSession from './session';
import { ThebeManager } from './manager';
import { MathjaxOptions, ThebeContext } from './types';

export interface CodeBlock {
  id: string;
  source: string;
  [x: string]: any;
}

class ThebeNotebook {
  id: string;
  cells?: ThebeCell[];
  session?: ThebeSession;

  static fromCodeBlocks(blocks: CodeBlock[], mathjaxOptions: MathjaxOptions) {
    const id = nanoid();
    const notebook = new ThebeNotebook(id);
    notebook.cells = blocks.map((c) => {
      const cell = new ThebeCell(c.id, id, c.source, mathjaxOptions);
      console.debug(`thebe:notebook:fromCodeBlocks Initializing cell ${c.id}`);
      return cell;
    });

    return notebook;
  }

  constructor(id: string) {
    this.id = id;
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
  }

  detachSession() {
    this.cells?.map((cell) => cell.detachSession());
  }

  async executeUpTo(cellId: string, preprocessor?: (s: string) => string) {
    if (!this.cells) return null;
    const idx = this.cells.findIndex((c) => c.id === cellId);
    if (idx === -1) return null;
    const cellsToExecute = this.cells.slice(0, idx + 1);
    cellsToExecute.map((cell) => cell.renderBusy(true));
    let result = null;
    for (let cell of cellsToExecute) {
      console.debug(`Executing cell ${cell.id}`);
      result = await cell?.execute(preprocessor ? preprocessor(cell.source) : cell.source);
      if (!result) {
        console.error(`Error executing cell ${cell.id}`);
        return null;
      }
    }
    return result;
  }

  async executeOnly(cellId: string, preprocessor?: (s: string) => string) {
    if (!this.cells) return null;
    return this.executeCells([cellId], preprocessor);
  }

  async executeCells(
    cellIds: string[],
    preprocessor?: (s: string) => string
  ): Promise<{
    height: number;
    width: number;
  } | null> {
    if (!this.cells) return null;
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
        return null;
      }
    }
    return result;
  }

  async executeAll(preprocessor?: (s: string) => string): Promise<{
    height: number;
    width: number;
  } | null> {
    if (!this.cells) return null;
    this.cells.map((cell) => cell.renderBusy(true));
    let result = null;
    for (let cell of this.cells) {
      result = await cell.execute(preprocessor ? preprocessor(cell.source) : cell.source);
      if (!result) {
        console.error(`Error executing cell ${cell.id}`);
        return null;
      }
    }
    return result;
  }
}

export default ThebeNotebook;
