import { MathjaxOptions, Options, ThebeContext } from './types';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { ThebeManager, WIDGET_MIMETYPE } from './manager';
import ThebeSession from './session';
import PassiveCellRenderer from './passive';

class ThebeCell extends PassiveCellRenderer {
  notebookId: string;
  session?: ThebeSession;
  source: string;

  constructor(id: string, notebookId: string, source: string, mathjaxOptions: MathjaxOptions) {
    super(id, mathjaxOptions);
    this.id = id;
    this.notebookId = notebookId;
    this.source = source;
  }

  get isBusy() {
    return this.area.node.parentElement?.querySelector(`[data-thebe-busy=c-${this.id}]`) != null;
  }

  get isAttached() {
    return this.session !== undefined;
  }

  /**
   * Wait for a kernel to be available and attach it to the cell
   *
   * NOTE: this function is intentended to be used when rendering a single cell only
   * If you are using mulitple cells via Notebook, you should use Notebook.waitForKernel instead
   *
   * @param session - ThebeKernel
   * @returns
   */
  async waitForSession(session: Promise<ThebeSession>) {
    return session.then((s) => {
      if (!s.kernel) throw Error('Session returned with no kernel connection');
      const cdnOnly = true;
      const manager = new ThebeManager(s.kernel, cdnOnly);
      this.attachSession(s, manager);
      return s;
    });
  }

  attachSession(session: ThebeSession, manager: ThebeManager) {
    this.rendermime.removeMimeType(WIDGET_MIMETYPE);
    if (this.rendermime) manager.addWidgetFactories(this.rendermime);
    this.session = session;
  }

  detachSession() {
    this.rendermime.removeMimeType(WIDGET_MIMETYPE);
    this.session = undefined;
  }

  renderBusy(show: boolean) {
    if (!this.isAttachedToDOM) return;
    console.debug(`thebe:renderer:busy ${show} ${this.id}`);
    if (show) {
      const busy = document.createElement('div');
      busy.className = 'thebe-busy';
      busy.style.position = 'absolute';
      busy.style.top = '0px';
      busy.style.left = '0px';
      busy.style.backgroundColor = 'white';
      busy.style.opacity = '0.5';
      busy.style.height = '100%';
      busy.style.width = '100%';
      busy.style.zIndex = '100';
      busy.setAttribute('data-thebe-busy', `c-${this.id}`);

      const spinner = document.createElement('div');
      spinner.className = 'thebe-core-busy-spinner';
      busy.append(spinner);

      this.area.node.parentElement?.append(busy);
    } else {
      const busy = this.area.node.parentElement?.querySelector('.thebe-busy');
      busy?.parentElement?.removeChild(busy);
    }
  }

  /**
   * TODO
   *  - pass execute_count or timestamp or something back to redux on success/failure?
   *
   * @param source
   * @returns
   */
  async execute(source: string): Promise<{ height: number; width: number } | null> {
    if (!this.session || !this.session.kernel) {
      console.warn('Attempting to execute on a cell without an attached kernel');
      return null;
    }

    try {
      console.debug(`thebe:renderer:execute ${this.id}`);
      if (!this.isBusy) this.renderBusy(true);

      const useShadow = true;
      if (useShadow) {
        // Use a shadow output area for the execute request
        const model = new OutputAreaModel({ trusted: true });
        console.log(`thebe:renderer:execute:rendermine`, this.rendermime);
        const area = new OutputArea({
          model,
          rendermime: this.rendermime!,
        });

        area.future = this.session.kernel?.requestExecute({ code: source });
        await area.future.done;

        // trigger an update via the model associated with the OutputArea
        // that is attached to the DOM
        this.model.fromJSON(model.toJSON());
      } else {
        this.area.future = this.session.kernel.requestExecute({
          code: source,
        });
        await this.area.future.done;
      }

      this.renderBusy(false);
      return {
        height: this.area.node.offsetHeight,
        width: this.area.node.offsetWidth,
      };
    } catch (err: any) {
      console.error('thebe:renderer:execute Error:', err);
      this.clearOnError(err);
      this.renderBusy(false);
      return null;
    }
  }
}

export default ThebeCell;
