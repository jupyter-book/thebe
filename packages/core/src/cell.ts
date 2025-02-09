import type { CellKind, IThebeCell, IThebeCellExecuteReturn, JsonObject } from './types';
import type ThebeSession from './session';
import PassiveCellRenderer from './passive';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { Config } from './config';
import { CellStatusEvent, ErrorStatusEvent, errorToMessage, EventSubject } from './events';
import { EventEmitter } from './emitter';
import type { ICodeCell, IError, IOutput } from '@jupyterlab/nbformat';
import { ensureString, shortId } from './utils';

class ThebeCodeCell extends PassiveCellRenderer implements IThebeCell {
  kind: CellKind;
  notebookId: string;
  source: string;
  metadata: JsonObject;
  session?: ThebeSession;
  executionCount: number | null;
  protected busy: boolean;
  protected events: EventEmitter;

  constructor(
    id: string,
    notebookId: string,
    source: string,
    outputs: IOutput[],
    config: Config,
    metadata: JsonObject,
    rendermime: IRenderMimeRegistry,
  ) {
    super(id, outputs, rendermime);
    this.kind = 'code';
    this.events = new EventEmitter(id, config, EventSubject.cell, this);
    this.notebookId = notebookId;
    this.source = source;
    this.metadata = metadata;
    this.busy = false;
    this.executionCount = null;
    console.debug('thebe:cell constructor', this);
  }

  static fromICodeCell(
    icc: ICodeCell,
    notebookId: string,
    config: Config,
    rendermime: IRenderMimeRegistry,
  ) {
    const cell = new ThebeCodeCell(
      icc.id ?? shortId(),
      notebookId,
      ensureString(icc.source),
      icc.outputs ?? [],
      config,
      icc.metadata,
      rendermime,
    );
    Object.assign(cell.metadata, icc.metadata);

    return cell;
  }

  get isBusy() {
    return this.busy;
  }

  get isAttached() {
    return this.session !== undefined;
  }

  get tags(): string[] {
    return this.metadata.tags ?? [];
  }

  /**
   * Attaches to the session and adds the widgets factory to the rendermine registry
   * call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::attachSession
   *
   * @param session
   */
  attachSession(session: ThebeSession) {
    this.session = session;
    this.events.triggerStatus({
      status: CellStatusEvent.attached,
      message: 'Attached to session',
    });
  }

  /**
   * Detaches from the session and removes the widgets factory from the rendermine registry
   * call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::detachSession
   *
   */
  detachSession() {
    this.session = undefined;
    this.events.triggerStatus({
      status: CellStatusEvent.detached,
      message: 'Detached from session',
    });
  }

  setAsBusy() {
    console.debug(`thebe:renderer:message:busy ${this.id}`);
    this.busy = true;
    this.events.triggerStatus({
      status: CellStatusEvent.executing,
      message: 'Executing...',
    });
  }

  setAsIdle() {
    console.debug(`thebe:renderer:message:completed ${this.id}`);
    this.busy = false;
    this.events.triggerStatus({
      status: CellStatusEvent.idle,
      message: 'Completed',
    });
  }

  /**
   * reset the DOM representation of the cell to the initial state
   * along with the execution count
   *
   * @param hideWidgets boolean - if true, hide widgets
   */
  initOutputs(initialOutputs: IOutput[]) {
    this.initialOutputs = initialOutputs;
    this.render(initialOutputs);
    this.executionCount = null;
  }

  /**
   * reset the DOM representation of the cell to the initial state
   * along with the execution count
   *
   * @param hideWidgets boolean - if true, hide widgets
   */
  reset() {
    this.render(this.initialOutputs);
    this.executionCount = null;
  }

  /**
   * TODO
   *  - pass execute_count or timestamp or something back to redux on success/failure?
   *
   * @param source?
   * @returns
   */
  async execute(source?: string): Promise<IThebeCellExecuteReturn | null> {
    if (!this.session || !this.session.kernel) {
      console.warn('Attempting to execute on a cell without an attached kernel');
      return null;
    }

    const code = source ?? this.source;

    try {
      console.debug(`thebe:renderer:execute ${this.id}`);
      if (!this.isBusy) this.setAsBusy();

      this.area.future = this.session.kernel.requestExecute({ code });

      // TODO consider how to enable execution without the await here
      const reply = await this.area.future.done;
      this.executionCount = reply.content.execution_count;

      let executeErrors: IError[] | undefined;
      for (let i = 0; i < this.model.length; i++) {
        const out = this.model.get(i);
        console.debug('thebecell:execute:output', { out: out.toJSON() });
        if (out.type === 'error') {
          const json = out.toJSON() as IError;
          if (json.ename === 'stderr') {
            this.events.triggerError({
              status: ErrorStatusEvent.warning,
              message: errorToMessage(json),
            });
          } else {
            if (!executeErrors) executeErrors = [json];
            else executeErrors?.push(json);
            this.events.triggerError({
              status: ErrorStatusEvent.executeError,
              message: errorToMessage(json),
            });
          }
        }
      }

      this.setAsIdle();
      return {
        id: this.id,
        height: this.area.node.offsetHeight,
        width: this.area.node.offsetWidth,
        error: executeErrors,
      };
    } catch (err: any) {
      console.error('thebe:renderer:execute Error:', err);
      this.clearOnError(err);
      this.events.triggerError(err.message);
      return null;
    }
  }
}

export default ThebeCodeCell;
