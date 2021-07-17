// import * as pWidget from "@lumino/widgets";

import { requireLoader } from "@jupyter-widgets/html-manager";

import * as pWidget from "@lumino/widgets";

import {
  RenderMimeRegistry,
  standardRendererFactories,
} from "@jupyterlab/rendermime";

import {
  WidgetManager as JupyterLabManager,
  WidgetRenderer,
  output,
} from "@jupyter-widgets/jupyterlab-manager";

import * as base from "@jupyter-widgets/base";

import * as controls from "@jupyter-widgets/controls";

const WIDGET_MIMETYPE = "application/vnd.jupyter.widget-view+json";

export class ThebeManager extends JupyterLabManager {
  constructor(kernel) {
    const context = createContext(kernel);
    const rendermime = createRenderMimeRegistry();
    super(context, rendermime);
    this._registerWidgets();
    this.loader = requireLoader;
  }

  _registerWidgets() {
    this.register({
      name: "@jupyter-widgets/base",
      version: base.JUPYTER_WIDGETS_VERSION,
      exports: base,
    });
    this.register({
      name: "@jupyter-widgets/controls",
      version: controls.JUPYTER_CONTROLS_VERSION,
      exports: controls,
    });
    this.register({
      name: "@jupyter-widgets/output",
      version: output.OUTPUT_WIDGET_VERSION,
      exports: output,
    });
  }

  async loadClass(className, moduleName, moduleVersion) {
    if (
      moduleName === "@jupyter-widgets/base" ||
      moduleName === "@jupyter-widgets/controls" ||
      moduleName === "@jupyter-widgets/output"
    ) {
      return super.loadClass(className, moduleName, moduleVersion);
    } else {
      // TODO: code duplicate from HTMLWidgetManager, consider a refactor
      return this.loader(moduleName, moduleVersion).then((module) => {
        if (module[className]) {
          return module[className];
        } else {
          return Promise.reject(
            "Class " +
              className +
              " not found in module " +
              moduleName +
              "@" +
              moduleVersion
          );
        }
      });
    }
  }

  display_view(msg, view, options) {
    const el = options.el;
    return Promise.resolve(view).then((view) => {
      pWidget.Widget.attach(view.pWidget, el);
      view.on("remove", function () {
        console.log("view removed", view);
      });
      return view;
    });
  }
}

function createContext(kernel) {
  return {
    sessionContext: {
      session: {
        kernel,
        kernelChanged: {
          connect: () => {},
        },
      },
      kernelChanged: {
        connect: () => {},
      },
      statusChanged: {
        connect: () => {},
      },
      connectionStatusChanged: {
        connect: () => {},
      },
    },
    saveState: {
      connect: () => {},
    },
  };
}

function createRenderMimeRegistry() {
  const rendermime = new RenderMimeRegistry({
    initialFactories: standardRendererFactories,
  });
  rendermime.addFactory(
    {
      safe: false,
      mimeTypes: [WIDGET_MIMETYPE],
      createRenderer: (options) => new WidgetRenderer(options, manager),
    },
    1
  );
  return rendermime;
}
