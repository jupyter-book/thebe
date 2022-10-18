import type { MathjaxOptions } from './types';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import type ThebeSession from './session';
import PassiveCellRenderer from './passive';
import type { MessageCallback, MessageCallbackArgs } from './messaging';
import { CellStatus, MessageSubject } from './messaging';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';

class ThebeCell extends PassiveCellRenderer {
  notebookId: string;
  source: string;
  busy: boolean;
  _session?: ThebeSession;
  _messages?: MessageCallback;

  constructor(
    id: string,
    notebookId: string,
    source: string,
    rendermime?: IRenderMimeRegistry,
    mathjaxOptions?: MathjaxOptions,
    messages?: MessageCallback,
  ) {
    super(id, rendermime, mathjaxOptions);
    this.id = id;
    this.notebookId = notebookId;
    this.source = source;
    this.busy = false;
    this._messages = messages;
  }

  get isBusy() {
    return this.busy;
  }

  get isAttached() {
    return this._session !== undefined;
  }

  get session() {
    return this._session;
  }

  set session(s: ThebeSession | undefined) {
    this._session = s;
  }

  message(data: Omit<MessageCallbackArgs, 'id' | 'subject' | 'object'>) {
    this._messages?.({
      ...data,
      id: this.id,
      subject: MessageSubject.cell,
      object: this,
    });
  }

  /**
   * Attaches to the session and adds the widgets factory to the rendermine registry
   * call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::attachSession
   *
   * @param session
   */
  attachSession(session: ThebeSession) {
    session.manager.addWidgetFactories(this.rendermime);
    this._session = session;
    this.message({
      status: CellStatus.changed,
      message: 'Attached to session',
    });
  }

  /**
   * Detaches from the session and removes the widgets factory from the rendermine registry
   * call this version if using ThebeCell in isolation, otherwise call ThebeNotebook::detachSession
   *
   */
  detachSession() {
    this._session?.manager.removeWidgetFactories(this.rendermime);
    this._session = undefined;
    this.message({
      status: CellStatus.changed,
      message: 'Detached from session',
    });
  }

  messageBusy() {
    console.debug(`thebe:renderer:message:busy ${this.id}`);
    this.busy = true;
    this.message({
      status: CellStatus.executing,
      message: 'Executing...',
    });
  }

  messageCompleted() {
    console.debug(`thebe:renderer:message:completed ${this.id}`);
    this.busy = false;
    this.message({
      status: CellStatus.completed,
      message: 'Completed',
    });
  }

  messageError(message: string) {
    console.debug(`thebe:renderer:message:error ${this.id}`);
    this.busy = false;
    this.message({
      status: CellStatus.completed,
      message: `Error... ${message}`,
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
    if (!this._session || !this._session.kernel) {
      console.warn('Attempting to execute on a cell without an attached kernel');
      return null;
    }

    const code = source ?? this.source;

    try {
      console.debug(`thebe:renderer:execute ${this.id}`);
      if (!this.isBusy) this.messageBusy();

      const useShadow = true;
      if (useShadow) {
        // Use a shadow output area for the execute request
        const model = new OutputAreaModel({ trusted: true });
        console.log(`thebe:renderer:execute:rendermine`, this.rendermime);
        const area = new OutputArea({
          model,
          rendermime: this.rendermime,
        });

        area.future = this._session.kernel?.requestExecute({ code });
        await area.future.done;

        // trigger an update via the model associated with the OutputArea
        // that is attached to the DOM
        this._model.fromJSON(model.toJSON());
      } else {
        this._area.future = this._session.kernel.requestExecute({ code });
        await this._area.future.done;
      }

      this.messageCompleted();
      return {
        id: this.id,
        height: this._area.node.offsetHeight,
        width: this._area.node.offsetWidth,
      };
    } catch (err: any) {
      console.error('thebe:renderer:execute Error:', err);
      this.clearOnError(err);
      this.messageError(err.message);
      return null;
    }
  }
}

export default ThebeCell;
