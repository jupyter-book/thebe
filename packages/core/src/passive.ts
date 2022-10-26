import type * as nbformat from '@jupyterlab/nbformat';
import { getRenderMimeRegistry } from './rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Widget } from '@lumino/widgets';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { IPassiveCell, MathjaxOptions } from './types';

class PassiveCellRenderer implements IPassiveCell {
  _id: string;
  _rendermime: IRenderMimeRegistry;
  _model: OutputAreaModel;
  _area: OutputArea;

  constructor(id: string, rendermime?: IRenderMimeRegistry, mathjax?: MathjaxOptions) {
    this._id = id;

    this._rendermime = rendermime ?? getRenderMimeRegistry(mathjax ?? {});
    this._model = new OutputAreaModel({ trusted: true });
    this._area = new OutputArea({
      model: this._model,
      rendermime: this._rendermime,
    });
  }

  get id() {
    return this._id;
  }

  get rendermime() {
    return this._rendermime;
  }

  get isAttachedToDOM() {
    return this._area.isAttached;
  }

  attachToDOM(el?: HTMLElement) {
    if (!this._area || !el) {
      console.error(
        `thebe:renderer:attachToDOM - could not attach to DOM - area: ${this._area}, el: ${el}`,
      );
      return;
    }
    if (this._area.isAttached) {
      console.warn(`thebe:renderer:attachToDOM - already attached, returning`);
      return;
    }
    console.debug(`thebe:renderer:attachToDOM ${this.id}`);

    // if the target element has contents, preserve it but wrap it in our output area
    if (el.innerHTML) {
      this._area.model.add({
        output_type: 'display_data',
        data: {
          'text/html': el.innerHTML,
        },
      });
    }
    el.textContent = '';

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.className = 'thebe-output';
    el.append(div);

    Widget.attach(this._area, div);
  }

  setOutputText(text: string) {
    if (!this._area) return;
    this._area.model.clear(true);
    this._area.model.add({
      output_type: 'stream',
      name: 'stdout',
      text,
    });
  }

  /**
   * Clears the output area model
   *
   * @returns
   */
  clear() {
    if (!this._area) return;
    this._area.model.clear();
  }

  /**
   * Will trigger the output to render an error with text taken from the optional argument
   *
   * @param error
   * @returns
   */
  clearOnError(error?: any) {
    if (!this._area) return;
    this._area.model.clear();
    this._area.model.add({
      output_type: 'stream',
      name: 'stderr',
      text: `Failed to execute. ${error ?? ''} Please refresh the page.`,
    });
  }

  /**
   * Render output data directly from json
   *
   * @param outputs - serialised jupyter outputs
   * @returns
   */
  render(outputs: nbformat.IOutput[]) {
    this._model.fromJSON(outputs);
  }
}

export default PassiveCellRenderer;
