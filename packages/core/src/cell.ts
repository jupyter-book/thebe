import type { IThebeCell } from './types';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import type ThebeSession from './session';
import PassiveCellRenderer from './passive';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { Config } from './config';
import { CellStatusEvent, EventSubject } from './events';
import { EventEmitter } from './emitter';

class ThebeCell extends PassiveCellRenderer implements IThebeCell {
  source: string;
  session?: ThebeSession;
  readonly notebookId: string;
  protected busy: boolean;
  protected events: EventEmitter;

  constructor(
    id: string,
    notebookId: string,
    source: string,
    config: Config,
    rendermime?: IRenderMimeRegistry,
  ) {
    super(id, rendermime);
    this.events = new EventEmitter(id, config, EventSubject.cell, this);
    this.notebookId = notebookId;
    this.source = source;
    this.busy = false;
  }

  get isBusy() {
    return this.busy;
  }

  get isAttached() {
    return this.session !== undefined;
  }

  /**
   * Attaches to the session and adds the widgets factory to the rendermine registry
   * call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::attachSession
   *
   * @param session
   */
  attachSession(session: ThebeSession) {
    session.manager.addWidgetFactories(this.rendermime);
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
    this.session?.manager.removeWidgetFactories(this.rendermime);
    this.session = undefined;
    this.events.triggerStatus({
      status: CellStatusEvent.detached,
      message: 'Detached from session',
    });
  }

  setAsBusy() {
    console.debug(`thebe:renderer:message:busy ${this._id}`);
    this.busy = true;
    this.events.triggerStatus({
      status: CellStatusEvent.executing,
      message: 'Executing...',
    });
  }

  setAsIdle() {
    console.debug(`thebe:renderer:message:completed ${this._id}`);
    this.busy = false;
    this.events.triggerStatus({
      status: CellStatusEvent.idle,
      message: 'Completed',
    });
  }

  /**
   * TODO
   *  - pass execute_count or timestamp or something back to redux on success/failure?
   *
   * @param source?
   * @returns
   */
  async execute(source?: string): Promise<{ id: string; height: number; width: number } | null> {
    if (!this.session || !this.session.kernel) {
      console.warn('Attempting to execute on a cell without an attached kernel');
      return null;
    }

    const code = source ?? this.source;

    try {
      console.debug(`thebe:renderer:execute ${this._id}`);
      if (!this.isBusy) this.setAsBusy();

      const useShadow = true;
      if (useShadow) {
        // Use a shadow output area for the execute request
        const model = new OutputAreaModel({ trusted: true });
        console.log(`thebe:renderer:execute:rendermine`, this.rendermime);
        const area = new OutputArea({
          model,
          rendermime: this.rendermime,
        });

        area.future = this.session.kernel?.requestExecute({ code });
        await area.future.done;

        // trigger an update via the model associated with the OutputArea
        // that is attached to the DOM
        this._model.fromJSON(model.toJSON());
      } else {
        this._area.future = this.session.kernel.requestExecute({ code });
        await this._area.future.done;
      }

      this.setAsIdle();
      return {
        id: this._id,
        height: this._area.node.offsetHeight,
        width: this._area.node.offsetWidth,
      };
    } catch (err: any) {
      console.error('thebe:renderer:execute Error:', err);
      this.clearOnError(err);
      this.events.triggerError(err.message);
      return null;
    }
  }
}

export default ThebeCell;
