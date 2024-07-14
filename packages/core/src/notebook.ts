import ThebeCodeCell from './cell';
import type ThebeSession from './session';
import type { IThebeCell, IThebeCellExecuteReturn } from './types';
import { shortId } from './utils';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { Config } from './config';
import { EventSubject, NotebookStatusEvent } from './events';
import { EventEmitter } from './emitter';
import type { ICodeCell, INotebookContent, INotebookMetadata } from '@jupyterlab/nbformat';
import ThebeMarkdownCell from './markdown';

export interface CodeBlock {
  id: string;
  source: string;
  [x: string]: any;
}

function coerceToObject(maybe: any): Record<string, any> {
  if (typeof maybe === 'object') return maybe;
  if (Array.isArray(maybe)) return Object.fromEntries(maybe.map((v, k) => [k, v]));
  return {};
}

class ThebeNotebook {
  readonly id: string;
  readonly rendermime: IRenderMimeRegistry;
  cells: IThebeCell[];
  metadata: INotebookMetadata;
  widgetState: Record<string, any>;
  session?: ThebeSession;
  protected events: EventEmitter;

  constructor(
    id: string,
    config: Config,
    rendermime: IRenderMimeRegistry,
    metadata?: INotebookMetadata,
  ) {
    this.id = id;
    this.events = new EventEmitter(id, config, EventSubject.notebook, this);
    this.cells = [];
    this.metadata = metadata ?? {};
    this.widgetState = coerceToObject(metadata?.widgets);
    this.rendermime = rendermime;
    console.debug('thebe:notebook constructor', this);
  }

  static fromCodeBlocks(blocks: CodeBlock[], config: Config, rendermime: IRenderMimeRegistry) {
    const id = shortId();
    const notebook = new ThebeNotebook(id, config, rendermime);
    notebook.cells = blocks.map((c) => {
      const metadata = {};
      const cell = new ThebeCodeCell(
        c.id,
        c.source,
        c.outputs ?? [],
        config,
        metadata,
        notebook.rendermime,
        notebook,
      );
      console.debug(`thebe:notebook:fromCodeBlocks Initializing cell ${c.id}`);
      return cell;
    });

    return notebook;
  }

  static fromIpynb(ipynb: INotebookContent, config: Config, rendermime: IRenderMimeRegistry) {
    const notebook = new ThebeNotebook(shortId(), config, rendermime);

    Object.assign(notebook.metadata, ipynb.metadata);

    notebook.cells = ipynb.cells.map((c) => {
      if ((c as ICodeCell).cell_type === 'code')
        return ThebeCodeCell.fromICodeCell(c as ICodeCell, config, notebook.rendermime, notebook);
      return ThebeMarkdownCell.fromICell(c, notebook.rendermime, notebook);
    });

    return notebook;
  }

  get parameters() {
    const p = this.findCells('parameters');
    if (!p || p?.length === 0) return undefined;
    if (p.length > 1) console.warn(`Mulitple parameter cells found in notebook ${this.id}`);
    return p;
  }

  /**
  @deprecated
   */
  get widgets() {
    return this.findCells('widget') ?? [];
  }

  get last() {
    if (this.cells.length === 0) throw new Error('empty notebook');
    return this.cells[this.cells.length - 1];
  }

  get markdown() {
    return this.cells.filter((c) => c.kind === 'markdown');
  }

  get code() {
    return this.cells.filter((c) => c.kind === 'code');
  }

  /**
   * reset the notebook to its initial state by resetting each cell
   *
   * @param hideWidgets boolean
   */
  reset() {
    this.cells.forEach((cell) => cell.reset());
  }

  numCells() {
    return this.cells?.length ?? 0;
  }

  findCells(tag: string) {
    const found = this.cells.filter((c) => c.tags.includes(tag));
    return found.length > 0 ? found : undefined;
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

  updateParameters(newSource: string, interpolate = false) {
    if (interpolate) throw new Error('Not implemented yet');
    if (this.parameters) this.parameters[0].source = newSource;
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
    this.cells?.forEach((cell) => (cell.session = session));
    this.events.triggerStatus({
      status: NotebookStatusEvent.attached,
      message: 'Attached to session',
    });
  }

  detachSession() {
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
  ): Promise<(IThebeCellExecuteReturn | null)[]> {
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
  ): Promise<IThebeCellExecuteReturn | null> {
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
  ): Promise<(IThebeCellExecuteReturn | null)[]> {
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
    } else {
      result = await Promise.all(
        cells.map((cell) => cell.execute(preprocessor ? preprocessor(cell.source) : cell.source)),
      );
    }

    this.events.triggerStatus({
      status: NotebookStatusEvent.idle,
      message: `executeCells executed ${cellIds.length} cells`,
    });
    return result;
  }

  async executeAll(
    stopOnError = false,
    preprocessor?: (s: string) => string,
  ): Promise<(IThebeCellExecuteReturn | null)[]> {
    if (!this.cells) return [];

    this.events.triggerStatus({
      status: NotebookStatusEvent.executing,
      message: `executeAll`,
    });

    this.cells.map((cell) => cell.setAsBusy());

    const result = await this.executeCells(
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
