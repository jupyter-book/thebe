import * as nbformat from '@jupyterlab/nbformat';
import { getRenderMimeRegistry } from './rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Widget } from '@lumino/widgets';
import { IRenderMime, RenderMimeRegistry } from '@jupyterlab/rendermime';
import { MathjaxOptions } from './types';

class PassiveCellRenderer {
  id: string;

  rendermime: RenderMimeRegistry;
  model: OutputAreaModel;
  area: OutputArea;

  constructor(id: string, mathjax?: MathjaxOptions) {
    this.id = id;

    this.rendermime = getRenderMimeRegistry(mathjax ?? {});
    this.model = new OutputAreaModel({ trusted: true });
    this.area = new OutputArea({
      model: this.model,
      rendermime: this.rendermime,
    });
  }

  get isAttachedToDOM() {
    return this.area.isAttached;
  }

  addFactory(factory: IRenderMime.IRendererFactory, rank?: number) {
    this.rendermime.addFactory(factory, rank);
  }

  attachToDOM(el?: HTMLElement) {
    if (!this.area || !el) return;
    if (this.area.isAttached) return;
    console.debug(`thebe:renderer:attach ${this.id}`);

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

    Widget.attach(this.area, div);
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

  clearOnError(error?: any) {
    if (!this.area) return;
    // could update redux with state here?
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
  }
}

export default PassiveCellRenderer;
