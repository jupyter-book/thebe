import $ from "jquery";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

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

// options
const _defaultOptions = {
  bootstrap: false,
  preRenderHook: false,
  stripPrompts: false,
  requestKernel: false,
  predefinedOutput: true,
  mountStatusWidget: false,
  mountActivateWidget: false,
  mathjaxUrl: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js",
  mathjaxConfig: "TeX-AMS_CHTML-full,Safe",
  selector: "[data-executable]",
  outputSelector: "[data-output]",
  binderOptions: {
    ref: "master",
    binderUrl: "https://mybinder.org",
    savedSession: {
      enabled: true,
      maxAge: 86400,
      storagePrefix: "thebe-binder-",
    },
  },
  kernelOptions: {
    path: "/",
    serverSettings: {
      appendToken: true,
    },
  },
};

let _pageConfigData = undefined;

function getPageConfig(key) {
  if (typeof window === "undefined") return;
  ensurePageConfigLoaded();
  return _pageConfigData[key];
}

function ensurePageConfigLoaded() {
  if (!_pageConfigData) {
    _pageConfigData = {};
    $("script[type='text/x-thebe-config']").map((i, el) => {
      if (el.getAttribute("data-thebe-loaded")) {
        // already loaded
        return;
      }
      el.setAttribute("data-thebe-loaded", "true");
      let thebeConfig = undefined;
      try {
        thebeConfig = eval(`(${el.textContent})`);
        if (thebeConfig) {
          console.log("loading thebe config", thebeConfig);
          $.extend(true, _pageConfigData, thebeConfig);
        } else {
          console.log("No thebeConfig found in ", el);
        }
      } catch (e) {
        console.error("Error loading thebe config", e, el.textContent);
      }
    });
  }
}

export function mergeOptions(options) {
  // merge options from various sources
  // call > page > defaults

  let merged = {};
  ensurePageConfigLoaded();

  $.extend(true, merged, _defaultOptions);
  $.extend(true, merged, _pageConfigData);
  if (options) $.extend(true, merged, options);
  return merged;
}

export function getOption(key) {
  return mergeOptions()[key];
}
