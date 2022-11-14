import { requireLoader } from './loader';
import type { DocumentRegistry } from '@jupyterlab/docregistry';
import type { INotebookModel } from '@jupyterlab/notebook';

import * as LuminoWidget from '@lumino/widgets';
import { MessageLoop } from '@lumino/messaging';

import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { RenderMimeRegistry, standardRendererFactories } from '@jupyterlab/rendermime';

import {
  WidgetManager as JupyterLabManager,
  WidgetRenderer,
  output,
} from '@jupyter-widgets/jupyterlab-manager';

import type { IKernelConnection } from '@jupyterlab/services/lib/kernel/kernel';
import type { ISessionConnection } from '@jupyterlab/services/lib/session/session';
import type { Widget } from '@lumino/widgets';

export const WIDGET_MIMETYPE = 'application/vnd.jupyter.widget-view+json';

import * as base from '@jupyter-widgets/base';
import * as controls from '@jupyter-widgets/controls';
import { shortId } from './utils';

if (typeof window !== 'undefined' && typeof window.define !== 'undefined') {
  window.define('@jupyter-widgets/base', base);
  window.define('@jupyter-widgets/controls', controls);
  window.define('@jupyter-widgets/output', output);
}

export class ThebeManager extends JupyterLabManager {
  loader: typeof requireLoader;
  id: string;

  constructor(kernel: IKernelConnection) {
    const context = createContext(kernel);
    const renderMime = new RenderMimeRegistry({
      initialFactories: standardRendererFactories,
    });
    super(context, renderMime, { saveState: false });

    this.id = shortId();
    this._registerWidgets();
    this.loader = (n: string, v: string) => requireLoader(n, v, true);
  }

  addWidgetFactories(rendermime: IRenderMimeRegistry) {
    rendermime.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_MIMETYPE],
        createRenderer: (options) => new WidgetRenderer(options, this),
      },
      1,
    );
  }

  removeWidgetFactories(rendermime: IRenderMimeRegistry) {
    rendermime.removeMimeType(WIDGET_MIMETYPE);
  }

  async build_widgets(): Promise<void> {
    await this._loadFromKernel();
    const tags = document.body.querySelectorAll(
      'script[type="application/vnd.jupyter.widget-view+json"]',
    );

    tags.forEach(async (viewtag) => {
      if (!viewtag?.parentElement) {
        return;
      }
      try {
        const widgetViewObject = JSON.parse(viewtag.innerHTML);
        const { model_id } = widgetViewObject;
        const model = await this.get_model(model_id);
        const widgetel = document.createElement('div');
        viewtag.parentElement.insertBefore(widgetel, viewtag);
        const view = await this.create_view(model);
        // TODO: fix typing
        await this.display_view(undefined as any, view, {
          el: widgetel,
        });
      } catch (error) {
        // Each widget view tag rendering is wrapped with a try-catch statement.
        //
        // This fixes issues with widget models that are explicitly "closed"
        // but are still referred to in a previous cell output.
        // Without the try-catch statement, this error interrupts the loop and
        // prevents the rendering of further cells.
        //
        // This workaround may not be necessary anymore with templates that make use
        // of progressive rendering.
      }
    });
  }

  async display_view(msg: any, view: any, options: any): Promise<Widget> {
    if (options.el) {
      LuminoWidget.Widget.attach(view.luminoWidget, options.el);
    }
    if (view.el) {
      view.el.setAttribute('thebe-jupyter-widget', '');
      view.el.addEventListener('jupyterWidgetResize', (e: Event) => {
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
    console.debug(`thebe:manager:loadClass ${moduleName}@${moduleVersion}`);
    if (
      moduleName === '@jupyter-widgets/base' ||
      moduleName === '@jupyter-widgets/controls' ||
      moduleName === '@jupyter-widgets/output'
    ) {
      return super.loadClass(className, moduleName, moduleVersion);
    } else {
      // TODO: code duplicate from HTMLWidgetManager, consider a refactor
      console.debug(`thebe:manager:loadClass using loader`);
      let module;
      try {
        module = await this.loader(moduleName, moduleVersion);
      } catch (err) {
        console.error(`thebe:manager:loadClass loader error`, err);
        throw err;
      }
      if (module[className]) {
        return module[className];
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
      exports: output as unknown as base.ExportData, // TODO improve typing
    });
  }
}

// TODO this could be a real context or at least some of these stubbed methods could be
// made real with appropeaite implementations for thebe
function createContext(kernel: IKernelConnection): DocumentRegistry.IContext<INotebookModel> {
  return {
    sessionContext: {
      session: {
        kernel,
        kernelChanged: {
          connect: () => {},
          disconnect: () => {},
        } as any, // TODO improve typing
      } as ISessionConnection,
      kernelChanged: {
        connect: () => {},
      } as any,
      statusChanged: {
        connect: () => {},
      } as any,
      connectionStatusChanged: {
        connect: () => {},
      } as any,
    },
    saveState: {
      connect: () => {},
    } as any,
    model: {
      metadata: {
        get: () => {},
      },
    } as any,
  } as DocumentRegistry.IContext<INotebookModel>;
}
