import ThebeCell from './cell';
import type ThebeSession from './session';
import type { IThebeCell, IThebeCellExecuteReturn } from './types';
import { shortId } from './utils';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { getRenderMimeRegistry } from './rendermime';
import type { Config } from './config';
import { EventSubject, NotebookStatusEvent } from './events';
import { EventEmitter } from './emitter';

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
  readonly id: string;
  readonly rendermime: IRenderMimeRegistry;
  cells: IThebeCell[];
  session?: ThebeSession;
  protected events: EventEmitter;

  constructor(id: string, config: Config, rendermime?: IRenderMimeRegistry) {
    this.id = id;
    this.events = new EventEmitter(id, config, EventSubject.notebook, this);
    this.cells = [];
    this.rendermime = rendermime ?? getRenderMimeRegistry(config.mathjax);
  }

  static fromCodeBlocks(blocks: CodeBlock[], config: Config) {
    const id = shortId();
    const notebook = new ThebeNotebook(id, config);
    notebook.cells = blocks.map((c) => {
      const cell = new ThebeCell(c.id, id, c.source, config, notebook.rendermime);
      console.debug(`thebe:notebook:fromCodeBlocks Initializing cell ${c.id}`);
      return cell;
    });

    return notebook;
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
    const cell = this.cells?.find((c) => c.id === id);
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
    if (!session.kernel) throw Error('ThebeNotebook - cannot connect to session, no kernel');
    // note all cells in a notebook share the rendermime registry
    // we only need to add the widgets factory once
    this.session = session;
    session.manager.addWidgetFactories(this.rendermime);
    this.cells?.forEach((cell) => (cell.session = session));
    this.events.triggerStatus({
      status: NotebookStatusEvent.attached,
      message: 'Attached to session',
    });
  }

  detachSession() {
    this.session?.manager.removeWidgetFactories(this.rendermime);
    this.cells?.map((cell) => (cell.session = undefined));
    this.session = undefined;
    this.events.triggerStatus({
      status: NotebookStatusEvent.detached,
      message: 'Detached from session',
    });
  }

  clear() {
    this.cells.forEach((cell) => cell.clear());
  }

  async executeUpTo(
    cellId: string,
    stopOnError = false,
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this.cells) return [];
    this.events.triggerStatus({
      status: NotebookStatusEvent.executing,
      message: `executeUpTo ${cellId}`,
    });
    const idx = this.cells.findIndex((c) => c.id === cellId);
    if (idx === -1) return [];
    const cellsToExecute = this.cells.slice(0, idx + 1);
    cellsToExecute.map((cell) => cell.setAsBusy());
    const result = await this.executeCells(
      cellsToExecute.map((c) => c.id),
      stopOnError,
      preprocessor,
    );
    // TODO intercept errors here
    this.events.triggerStatus({
      status: NotebookStatusEvent.idle,
      message: `executeUpTo ${cellId}`,
    });

    return result;
  }

  async executeOnly(
    cellId: string,
    preprocessor?: (s: string) => string,
  ): Promise<ExecuteReturn | null> {
    if (!this.cells) return null;
    this.events.triggerStatus({
      status: NotebookStatusEvent.executing,
      message: `executeOnly ${cellId}`,
    });
    const result = await this.executeCells([cellId], false, preprocessor);
    this.events.triggerStatus({
      status: NotebookStatusEvent.idle,
      message: `executeUpTo ${cellId}`,
    });

    return result[0];
  }

  async executeCells(
    cellIds: string[],
    stopOnError = false,
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this.cells) return [];
    this.events.triggerStatus({
      status: NotebookStatusEvent.executing,
      message: `executeCells ${cellIds.length} cells`,
    });
    const cells = this.cells.filter((c) => {
      const found = cellIds.find((id) => id === c.id);
      if (!found) {
        console.warn(`Cell ${c.id} not found in notebook`);
      }
      return Boolean(found);
    });

    let result: (IThebeCellExecuteReturn | null)[] = [];

    if (stopOnError) {
      let skipRemaining = false;
      for (const cell of cells) {
        if (skipRemaining) continue;
        const cellReturn = await cell.execute(
          preprocessor ? preprocessor(cell.source) : cell.source,
        );
        if (cellReturn == null || cellReturn.error) skipRemaining = true;
        result.push(cellReturn);
      }
    }

    result = await Promise.all(
      cells.map((cell) => cell.execute(preprocessor ? preprocessor(cell.source) : cell.source)),
    );

    this.events.triggerStatus({
      status: NotebookStatusEvent.idle,
      message: `executeCells ${cellIds.length} cells`,
    });
    return result;
  }

  async executeAll(
    stopOnError = false,
    preprocessor?: (s: string) => string,
  ): Promise<(ExecuteReturn | null)[]> {
    if (!this.cells) return [];

    this.events.triggerStatus({
      status: NotebookStatusEvent.executing,
      message: `executeAll`,
    });

    this.cells.map((cell) => cell.setAsBusy());

    const result = this.executeCells(
      this.cells.map((c) => c.id),
      stopOnError,
      preprocessor,
    );

    this.events.triggerStatus({
      status: NotebookStatusEvent.idle,
      message: `executeAll`,
    });

    return result;
  }
}

export default ThebeNotebook;
