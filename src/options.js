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

/**
 * Thebe options object
 */
export class Options {
  /**
   * Option object will be constructed with all defaults
   */
  constructor() {
    /**
     * When set to ``true`` will bootstrap the library on load
     * @type {boolean}
     * @public
     */
    this.bootstrap = false;

    /**
     * Either ``false`` or set to an arbitrary function which is called as part of ``bootstrap``
     * @type {(function|false)}
     * @public
     */
    this.preRenderHook = false;

    /**
     * Either false or set to an object with the details of the prompts to strip
     * @type {(object|false)}
     * @public
     * @example
     * stripPrompts: {
     *  inPrompt: 'sage: ',
     *  continuationPrompt: '....: ',
     *  selector: '.sage-input',
     * },
     */
    this.stripPrompts = false;

    /**
     * Either false or set to an object with the details of the prompts to strip
     * @type {(object|false)}
     * @public
     * @example
     * stripOutputPrompts: {
     *  outPrompt: 'out: ',
     * },
     */
    this.stripOutputPrompts = false;

    /**
     * Whether to request the kernel immediately when thebe is bootstrapped
     * instead of on executing code for the first time
     * @type {boolean}
     * @public
     */
    this.requestKernel = false;

    /**
     * Whether thebe should look for predefined output of cells before execution
     *
     * If this option is enabled and the next div after the cell has the attribute
     * ``data-output=true`` (default), then the content of this div is rendered as output
     *
     * @type {boolean}
     * @public
     * */
    this.predefinedOutput = true;

    /**
     * When set to ``true`` will attempt to mount a status widget onto any element
     * with ``class='.thebe-status'`` during bootstrap
     *
     * @type {boolean}
     * @public
     */
    this.mountStatusWidget = true;

    /**
     * When set to ``true`` will attempt to mount an activatebutton onto any element
     * with ``class='.thebe-activate'`` during bootstrap
     */
    this.mountActivateWidget = true;

    /**
     * Set the URL from which to load mathjax. Set to false to disable mathjax.
     *
     * @type {boolean}
     * @public
     * @example
     * // defajult value
     * mathjaxUrl: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js"
     */
    this.mathjaxUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js";

    /**
     * Override the mathjax configuration query string.
     *
     * Read more on mathjax configuration here: https://docs.mathjax.org/en/v2.7-latest/configuration.html#loading-and-configuring-mathjax
     *
     * @type {boolean}
     * @public
     * @example
     * //default value
     * mathjaxConfig: "TeX-AMS_CHTML-full,Safe";
     */
    this.mathjaxConfig = "TeX-AMS_CHTML-full,Safe";

    /**
     * CSS Selector for identifying which elements on the page should be made active
     *
     * @type {string}
     * @public
     * @example
     * // default value
     * selector: "[data-executable]"
     */
    this.selector = "[data-executable]";

    /**
     * CSS selector for identifying whether an element should be treated as output
     *
     * @type {string}
     * @public
     * @example
     * // default value
     * outputSelector: "[data-output]"
     */
    this.outputSelector = "[data-output]";

    /**
     * Options for requesting a notebook server from mybinder.org
     *
     * @type {(object|false)}
     * @public
     * @example
     * // default value
     * binderOptions: {
     *   repo: "minrk/ligo-binder",
     *   ref: "master",
     *   binderUrl: "https://mybinder.org",
     *   savedSession: {
     *     enabled: true,
     *     maxAge: 86400,
     *     storagePrefix: "thebe-binder-",
     *   },
     * }
     */
    this.binderOptions = {
      repo: "minrk/ligo-binder",
      ref: "master",
      binderUrl: "https://mybinder.org",
      savedSession: {
        enabled: true,
        maxAge: 86400,
        storagePrefix: "thebe-binder-",
      },
    };

    /**
     * Options for requesting a kernel from the notebook server
     *
     * @type {(object|undefined)}
     * @public
     * @example
     * // default value
     * kernelOptions: {
     *   path: "/",
     *   serverSettings: {
     *     appendToken: true,
     *   },
     * };
     * @example
     * // python kernel from notebook server on mybinder.org
     * kernelOptions: {
     *   name: "python3",
     *   kernelName: "python3",
     *   path: "."
     * },
     * @example
     * // python kernel from a local notebook server
     * kernelOptions: {
     *   name: "python3",
     *   kernelName: "python3",
     *   path: ".",
     *   serverSettings: {
     *     "baseUrl": "http://127.0.0.1:8888",
     *     "token": "test-secret"
     *   }
     * },
     */
    this.kernelOptions = {
      path: "/",
      serverSettings: {
        appendToken: true,
      },
    };
  }
}

// options
const _defaultOptions = new Options();

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
