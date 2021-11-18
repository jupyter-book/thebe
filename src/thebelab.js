import $ from "jquery";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";

import { ThebeManager } from "./manager";
import { hookupKernel, requestKernel, requestBinderKernel } from "./kernels";
import { mergeOptions } from "./options";
import { renderAllCells } from "./render";
import { stripPrompts, stripOutputPrompts } from "./utils";
import * as events from "./events";
import { KernelStatus } from "./status";
import { ActivateWidget } from "./activate";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

import "@jupyterlab/theme-light-extension/style/theme.css";
import "@jupyter-widgets/controls/css/widgets-base.css";
import "@lumino/widgets/style/index.css";
import "@jupyterlab/apputils/style/base.css";
import "@jupyterlab/rendermime/style/base.css";
import "@jupyterlab/codemirror/style/base.css";
import "./index.css";
import "./status.css";
import "./activate.css";

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import { output } from "@jupyter-widgets/jupyterlab-manager";

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
  window.define("@jupyter-widgets/base", base);
  window.define("@jupyter-widgets/controls", controls);
  window.define("@jupyter-widgets/output", output);
}

export * from "./render";
export * from "./kernels";
export * from "./options";
export * from "./events";

export function mountStatusWidget() {
  thebelab.kernelStatus = new KernelStatus(thebelab);
  thebelab.kernelStatus.mount();
}

export function mountActivateWidget() {
  thebelab.activateButton = new ActivateWidget(thebelab);
  thebelab.activateButton.mount();
}

/**
 * Bootstrap the library based on the configuration given.
 *
 * If bootstrap === true in the configuration and the library is loaded statically
 * then this function will be called automatically on the document load event.
 *
 * @param {Object} options Object containing thebe options.
 * Same structure as x-thebe-options.
 * @returns {Promise} Promise for connected Kernel object
 */
export function bootstrap(options) {
  // bootstrap thebe on the page
  // merge defaults, pageConfig, etc.
  options = mergeOptions(options);

  if (options.preRenderHook) {
    options.preRenderHook();
  }
  if (options.stripPrompts) {
    stripPrompts(options.stripPrompts);
  }
  if (options.stripOutputPrompts) {
    stripOutputPrompts(options.stripOutputPrompts);
  }

  function getKernel() {
    if (options.binderOptions.repo) {
      return requestBinderKernel({
        binderOptions: options.binderOptions,
        kernelOptions: options.kernelOptions,
      });
    } else {
      return requestKernel(options.kernelOptions);
    }
  }

  let kernelPromise;
  if (options.requestKernel) {
    kernelPromise = getKernel();
  } else {
    kernelPromise = new Promise((resolve, reject) => {
      events.one("request-kernel", () => {
        getKernel().then(resolve).catch(reject);
      });
    });
  }

  // bootstrap thebelab on the page
  const cells = renderAllCells({
    selector: options.selector,
  });

  kernelPromise.then((kernel) => {
    // debug
    if (typeof window !== "undefined") window.thebeKernel = kernel;

    const manager = new ThebeManager(kernel);

    hookupKernel(kernel, cells, manager);
  });
  if (window.thebelab) window.thebelab.cells = cells;
  return kernelPromise;
}
