import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { RenderMimeRegistry, standardRendererFactories } from '@jupyterlab/rendermime';
import type { IKernelConnection } from '@jupyterlab/services/lib/kernel/kernel';
import type { Widget } from '@lumino/widgets';

import * as LuminoWidget from '@lumino/widgets';
import { MessageLoop } from '@lumino/messaging';

import { KernelWidgetManager, WidgetRenderer, output } from '@jupyter-widgets/jupyterlab-manager';

export const WIDGET_MIMETYPE = 'application/vnd.jupyter.widget-view+json';

import * as base from '@jupyter-widgets/base';
import * as controls from '@jupyter-widgets/controls';
import { shortId } from './utils';
import { RequireJsLoader } from './requireJsLoader';
import { requireLoader } from './loader';

/**
 * A Widget Manager class for Thebe using the context-free KernelWidgetManager from
 * the JupyterLab  Manager and inspierd by the implementation in Voila here:
 * https://github.dev/voila-dashboards/voila/blob/main/packages/voila/src/manager.ts
 *
 */
export class ThebeManager extends KernelWidgetManager {
  id: string;
  _loader: RequireJsLoader;

  constructor(kernel: IKernelConnection, rendermime?: IRenderMimeRegistry) {
    const rm =
      rendermime ??
      new RenderMimeRegistry({
        initialFactories: standardRendererFactories,
      });

    /** ensure this registry always gets the widget renderer.
     * This is essential for cases where widgets are rendered heirarchically
     */
    rm.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_MIMETYPE],
        createRenderer: (options) => new WidgetRenderer(options, this as any),
      },
      1,
    );

    super(kernel, rm);

    this.id = shortId();
    this._registerWidgets();
    this._loader = new RequireJsLoader();
  }

  addWidgetFactories(rendermime: IRenderMimeRegistry) {
    rendermime.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_MIMETYPE],
        createRenderer: (options) => new WidgetRenderer(options, this as any),
      },
      1,
    );
  }

  removeWidgetFactories(rendermime: IRenderMimeRegistry) {
    rendermime.removeMimeType(WIDGET_MIMETYPE);
  }

  /**
   * TODO implement a reasonable method for thebe-core that can load serialized widget state
   * see: https://github.dev/voila-dashboards/voila/blob/7090eb3e30c0c4aa25c2b7d5d2d45e8de1333b3b/packages/voila/src/manager.ts#L52
   *
   */
  async build_widgets(): Promise<void> {
    throw new Error('ThebeManager:build_widgets not implmented');
  }

  async display_view(msg: any, view: any, options: any): Promise<Widget> {
    if (options.el) {
      LuminoWidget.Widget.attach(view.luminoWidget, options.el);
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

    if (
      moduleName === '@jupyter-widgets/base' ||
      moduleName === '@jupyter-widgets/controls' ||
      moduleName === '@jupyter-widgets/output'
    ) {
      return super.loadClass(className, moduleName, moduleVersion);
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

  private _registerWidgets() {
    this.register({
      name: '@jupyter-widgets/base',
      version: base.JUPYTER_WIDGETS_VERSION,
      exports: base as unknown as base.ExportData, // TODO improve typing
    });
    this.register({
      name: '@jupyter-widgets/controls',
      version: controls.JUPYTER_CONTROLS_VERSION,
      exports: controls as unknown as base.ExportData, // TODO improve typing
    });
    this.register({
      name: '@jupyter-widgets/output',
      version: output.OUTPUT_WIDGET_VERSION,
      exports: output as any,
    });
  }
}
