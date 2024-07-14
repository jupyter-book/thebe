import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { Widget } from '@lumino/widgets';

import * as LuminoWidget from '@lumino/widgets';
import { MessageLoop } from '@lumino/messaging';

import { WidgetRenderer, output } from '@jupyter-widgets/jupyterlab-manager';
import type { IManagerState } from '@jupyter-widgets/base-manager';
import { ManagerBase } from '@jupyter-widgets/base-manager';

import * as base from '@jupyter-widgets/base';
import * as controls from '@jupyter-widgets/controls';
import { shortId } from './utils';
import { RequireJsLoader } from './requireJsLoader';
import { requireLoader } from './loader';
import { WIDGET_VIEW_MIMETYPE } from './manager';

/**
 * A Widget Manager class for Thebe using the context-free KernelWidgetManager from
 * the JupyterLab  Manager and inspierd by the implementation in Voila here:
 * https://github.dev/voila-dashboards/voila/blob/main/packages/voila/src/manager.ts
 *
 */
export class ThebePassiveManager extends ManagerBase {
  id: string;
  _loader: RequireJsLoader;
  views: Record<string, base.DOMWidgetView> = {};

  constructor(widgetState?: IManagerState) {
    super();

    this.id = shortId();
    this._loader = new RequireJsLoader();
    if (widgetState) {
      this.load_state(widgetState);
    }
  }

  static addWidgetRenderer(rendermime: IRenderMimeRegistry) {
    rendermime.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_VIEW_MIMETYPE],
        createRenderer: (options) => new WidgetRenderer(options, this as any),
      },
      1,
    );
  }

  /**
   * TODO implement a reasonable method for thebe-core that can load serialized widget state
   * see: https://github.dev/voila-dashboards/voila/blob/7090eb3e30c0c4aa25c2b7d5d2d45e8de1333b3b/packages/voila/src/manager.ts#L52
   */
  async load_state(state: IManagerState): Promise<any[]> {
    return this.set_state(state);
  }

  async hydrate(model_id: string, el: any): Promise<void> {
    console.debug(`thebe:manager:hydrate ${model_id}`);
    const model = await this.get_model(model_id);
    console.debug(`thebe:manager:hydrate ${model_id} model`, model);
    const view = await this.create_view(model);
    this.views[model_id] = view;
    console.debug(`thebe:manager:hydrate ${model_id} view`, view);
    console.debug(`thebe:manager:hydrate ${model_id} el`, el);
    this.display_view(view, el);
    console.debug(`thebe:manager:hydrate ${model_id} done`);
  }

  _get_comm_info() {
    return Promise.resolve({});
  }

  _create_comm() {
    return Promise.reject('no comms available');
  }

  async display_view(view: any, el?: any): Promise<Widget> {
    if (el) {
      LuminoWidget.Widget.attach(view.luminoWidget, el);
    }
    if (view.el) {
      view.el.setAttribute('data-thebe-jupyter-widget', '');
      view.el.addEventListener('jupyterWidgetResize', () => {
        MessageLoop.postMessage(view.luminoWidget, LuminoWidget.Widget.ResizeMessage.UnknownSize);
      });
    }
    return view.luminoWidget;
  }

  async loadClass(
    className: string,
    moduleName: string,
    moduleVersion: string,
  ): Promise<typeof base.WidgetModel | typeof base.WidgetView> {
    if (!this._loader.requested) {
      console.debug(`thebe:manager:loadClass initial requirejs load ${this.id}`);
      this._loader.load((require, define) => {
        define('@jupyter-widgets/base', base as any);
        define('@jupyter-widgets/controls', controls as any);
        define('@jupyter-widgets/output', output as any);
      });
    }

    console.debug(`thebe:manager:loadClass ${moduleName}@${moduleVersion}`);
    const rjs = await this._loader.ready;

    if (moduleName === '@jupyter-widgets/base') {
      return (base as Record<string, any>)[className];
    } else if (moduleName === '@jupyter-widgets/controls') {
      return (controls as Record<string, any>)[className];
    } else if (moduleName === '@jupyter-widgets/output') {
      return (output as Record<string, any>)[className];
    } else {
      let mod;
      try {
        mod = await requireLoader(rjs, moduleName, moduleVersion);
      } catch (err) {
        console.error(`thebe:manager:loadClass loader error`, err);
        throw err;
      }
      if (mod[className]) {
        return mod[className];
      } else {
        console.error(
          `thebe:manager:loadClass ${className} not found in module ${moduleName}@${moduleVersion}`,
        );
        throw new Error(`Class ${className} not found in module ${moduleName}@${moduleVersion}`);
      }
    }
  }
}
