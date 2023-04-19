import type * as nbformat from '@jupyterlab/nbformat';
import { getRenderMimeRegistry } from './rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { IPassiveCell, MathjaxOptions } from './types';
import { makeMathjaxOptions } from './options';
import { Widget } from '@lumino/widgets';
import { MessageLoop } from '@lumino/messaging';
import { WIDGET_MIMETYPE } from './manager';
import { ensureString } from './utils';

function isMimeBundle({ output_type }: nbformat.IOutput) {
  return output_type === 'display_data' || output_type === 'execute_result';
}

const placeholder = (plainText?: string) => `
<div class="thebe-ipywidgets-placeholder">
  <div class="thebe-ipywidgets-placeholder-image"></div>
  <div class="thebe-ipywidgets-placeholder-message"><code>ipywidgets</code> - a Jupyter kernel connection is required to fully display this output.</div>
  ${plainText && `<pre>${plainText}</pre>`}
</div>
`;

function stripWidgets(outputs: nbformat.IOutput[], hideWidgets?: boolean) {
  return outputs.map((output: nbformat.IOutput) => {
    if (!isMimeBundle(output)) return output;
    const { [WIDGET_MIMETYPE]: widgets, ...others } = output.data as nbformat.IMimeBundle;
    if (!widgets) return output;
    const data = { ...others };
    if (!hideWidgets && !('text/html' in data))
      // if there is not already an html bundle, add a placeholder to hide the plain/text field
      data['text/html'] = placeholder(ensureString(data['text/plain'] as string | string[]));
    else if (hideWidgets) {
      delete data['text/plain'];
    }
    const stripped = {
      ...output,
      data,
    };
    return stripped;
  });
}

class PassiveCellRenderer implements IPassiveCell {
  readonly id: string;
  readonly rendermime: IRenderMimeRegistry;
  protected model: OutputAreaModel;
  protected area: OutputArea;

  constructor(id: string, rendermime?: IRenderMimeRegistry, mathjax?: MathjaxOptions) {
    this.id = id;
    this.rendermime = rendermime ?? getRenderMimeRegistry(mathjax ?? makeMathjaxOptions());
    this.model = new OutputAreaModel({ trusted: true });
    this.area = new OutputArea({
      model: this.model,
      rendermime: this.rendermime,
    });
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

  attachToDOM(el?: HTMLElement, strict = false) {
    if (!this.area || !el) {
      console.error(
        `thebe:renderer:attachToDOM - could not attach to DOM - area: ${this.area}, el: ${el}`,
      );
      return;
    }
    if (this.area.isAttached) {
      console.warn(`thebe:renderer:attachToDOM - already attached`);
      if (strict) return;
    }
    console.debug(`thebe:renderer:attachToDOM ${this.id}`);

    // if the target element has contents, preserve it but wrap it in our output area
    if (el.innerHTML) {
      this.area.model.add({
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
  render(outputs: nbformat.IOutput[], hideWidgets?: boolean) {
    this.model.fromJSON(stripWidgets(outputs, hideWidgets));
  }
}

export default PassiveCellRenderer;
