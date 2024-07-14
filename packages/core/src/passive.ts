import type * as nbformat from '@jupyterlab/nbformat';
import { makeRenderMimeRegistry } from './rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { IPassiveCell, MathjaxOptions } from './types';
import { makeMathjaxOptions } from './options';
import { Widget } from '@lumino/widgets';
import { MessageLoop } from '@lumino/messaging';

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

class PassiveCellRenderer implements IPassiveCell {
  readonly id: string;
  readonly rendermime: IRenderMimeRegistry;
  initialOutputs: nbformat.IOutput[];

  protected model: OutputAreaModel;
  protected area: OutputArea;

  constructor(
    id: string,
    initialOutputs?: nbformat.IOutput[],
    rendermime?: IRenderMimeRegistry,
    mathjax?: MathjaxOptions,
  ) {
    this.id = id;
    this.rendermime = rendermime ?? makeRenderMimeRegistry(mathjax ?? makeMathjaxOptions());
    assert(this.rendermime, 'no rendermime');
    console.log('rendermime', this.rendermime);
    this.model = new OutputAreaModel({ trusted: true });
    this.area = new OutputArea({
      model: this.model,
      rendermime: this.rendermime,
    });
    this.initialOutputs = initialOutputs ?? [];
  }

  /**
   * Serialize the model state to JSON
   */
  get outputs(): nbformat.IOutput[] {
    return this.model.toJSON();
  }

  get isAttachedToDOM() {
    return this.area.isAttached;
  }

  attachToDOM(
    el?: HTMLElement,
    opts: { strict?: boolean; appendExisting?: boolean } = { strict: false, appendExisting: true },
  ) {
    if (!this.area || !el) {
      console.error(
        `thebe:renderer:attachToDOM - could not attach to DOM - area: ${this.area}, el: ${el}`,
      );
      return;
    }
    if (this.area.isAttached) {
      // TODO should we detach and reattach?
      console.debug(`thebe:renderer:attachToDOM - already attached`);
      if (opts.strict) return;
    } else {
      // if the target element has contents, preserve it but wrap it in our output area
      console.debug(`thebe:renderer:attachToDOM ${this.id} - appending existing contents`);
      if (opts.appendExisting && el.innerHTML) {
        this.area.model.add({
          output_type: 'display_data',
          data: {
            'text/html': el.innerHTML,
          },
        });
      }
    }

    el.textContent = '';

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.className = 'thebe-output';
    el.append(div);

    MessageLoop.sendMessage(this.area, Widget.Msg.BeforeAttach);
    div.appendChild(this.area.node);
    MessageLoop.sendMessage(this.area, Widget.Msg.AfterAttach);
  }

  setOutputText(text: string) {
    if (!this.area) return;
    this.area.model.clear(true);
    this.area.model.add({
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
    if (!this.area) return;
    this.area.model.clear();
  }

  /**
   * Will trigger the output to render an error with text taken from the optional argument
   *
   * @param error
   * @returns
   */
  clearOnError(error?: any) {
    if (!this.area) return;
    this.area.model.clear();
    this.area.model.add({
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
    this.model.fromJSON(outputs);
    this.hydrate();
  }

  hydrate() {
    console.log('maybe hydrate', this);
  }
}

export default PassiveCellRenderer;
