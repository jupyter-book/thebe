import $ from "jquery";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

import { Widget } from "@lumino/widgets";
import { KernelManager, KernelAPI } from "@jupyterlab/services";
import { ServerConnection } from "@jupyterlab/services";
import { MathJaxTypesetter } from "@jupyterlab/mathjax2";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import {
  RenderMimeRegistry,
  standardRendererFactories,
} from "@jupyterlab/rendermime";
import {
  WIDGET_MIMETYPE,
  WidgetRenderer,
} from "@jupyter-widgets/html-manager/lib/output_renderers";
import { ThebeManager } from "./manager";
import { requireLoader } from "@jupyter-widgets/html-manager";

import { Mode } from "@jupyterlab/codemirror";

import "@jupyterlab/theme-light-extension/style/index.css";
import "@jupyter-widgets/controls/css/widgets-base.css";
import "@jupyterlab/rendermime/style/index.css";
import "./index.css";

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";

if (typeof window !== "undefined" && typeof window.define !== "undefined") {
  window.define("@jupyter-widgets/base", base);
  window.define("@jupyter-widgets/controls", controls);
}

// events

export const events = $({});
export const on = function () {
  events.on.apply(events, arguments);
};
export const one = function () {
  events.one.apply(events, arguments);
};
export const off = function () {
  events.off.apply(events, arguments);
};

// options

const _defaultOptions = {
  bootstrap: false,
  preRenderHook: false,
  stripPrompts: false,
  requestKernel: false,
  predefinedOutput: true,
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
  return _pageConfigData[key];
}

export function mergeOptions(options) {
  // merge options from various sources
  // call > page > defaults
  let merged = {};
  getPageConfig();
  $.extend(true, merged, _defaultOptions);
  $.extend(true, merged, _pageConfigData);
  if (options) $.extend(true, merged, options);
  return merged;
}

export function getOption(key) {
  return mergeOptions()[key];
}

let _renderers = undefined;
function getRenderers(options) {
  if (!_renderers) {
    _renderers = standardRendererFactories.filter((f) => {
      // filter out latex renderer if mathjax is unavailable
      if (f.mimeTypes.indexOf("text/latex") >= 0) {
        if (options.mathjaxUrl) {
          return true;
        } else {
          console.log("MathJax unavailable");
          return false;
        }
      } else {
        return true;
      }
    });
  }
  return _renderers;
}
// rendering cells

function renderCell(element, options) {
  // render a single cell
  // element should be a `<pre>` tag with some code in it
  let mergedOptions = mergeOptions({ options });
  let $cell = $("<div class='thebelab-cell'/>");
  let $element = $(element);
  let $output = $element.next(mergedOptions.outputSelector);
  let source = $element.text().trim();
  let renderers = {
    initialFactories: getRenderers(mergedOptions),
  };
  if (mergedOptions.mathjaxUrl) {
    renderers.latexTypesetter = new MathJaxTypesetter({
      url: mergedOptions.mathjaxUrl,
      config: mergedOptions.mathjaxConfig,
    });
  }
  let renderMime = new RenderMimeRegistry(renderers);

  let manager = options.manager;

  renderMime.addFactory(
    {
      safe: false,
      mimeTypes: [WIDGET_MIMETYPE],
      createRenderer: (options) => new WidgetRenderer(options, manager),
    },
    1
  );

  let model = new OutputAreaModel({ trusted: true });

  let outputArea = new OutputArea({
    model: model,
    rendermime: renderMime,
  });

  $element.replaceWith($cell);

  let $cm_element = $("<div class='thebelab-input'>");
  $cell.append($cm_element);
  $cell.append(
    $("<button class='thebelab-button thebelab-run-button'>")
      .text("run")
      .attr("title", "run this cell")
      .click(execute)
  );
  $cell.append(
    $("<button class='thebelab-button thebelab-restart-button'>")
      .text("restart")
      .attr("title", "restart the kernel")
      .click(restart)
  );
  $cell.append(
    $("<button class='thebelab-button thebelab-restartall-button'>")
      .text("restart & run all")
      .attr("title", "restart the kernel and run all cells")
      .click(restartAndRunAll)
  );
  let kernelResolve, kernelReject;
  let kernelPromise = new Promise((resolve, reject) => {
    kernelResolve = resolve;
    kernelReject = reject;
  });
  kernelPromise.then((kernel) => {
    $cell.data("kernel", kernel);
    manager.registerWithKernel(kernel);
    return kernel;
  });
  $cell.data("kernel-promise-resolve", kernelResolve);
  $cell.data("kernel-promise-reject", kernelReject);

  if ($output.length && mergedOptions.predefinedOutput) {
    outputArea.model.add({
      output_type: "display_data",
      data: {
        "text/html": $output.html(),
      },
    });
    $output.remove();
  }

  function setOutputText(text = "Waiting for kernel...") {
    outputArea.model.clear();
    outputArea.model.add({
      output_type: "stream",
      name: "stdout",
      text,
    });
  }

  function execute() {
    let kernel = $cell.data("kernel");
    let code = cm.getValue();
    if (!kernel) {
      console.debug("No kernel connected");
      setOutputText();
      events.trigger("request-kernel");
    }
    kernelPromise.then((kernel) => {
      try {
        outputArea.future = kernel.requestExecute({ code: code });
      } catch (error) {
        outputArea.model.clear();
        outputArea.model.add({
          output_type: "stream",
          name: "stderr",
          text: `Failed to execute. ${error} Please refresh the page.`,
        });
      }
    });
    return false;
  }

  function restart() {
    let kernel = $cell.data("kernel");
    if (kernel) {
      return kernelPromise.then(async (kernel) => {
        await kernel.restart();
        return kernel;
      });
    }
    return Promise.resolve(kernel);
  }

  function restartAndRunAll() {
    if (window.thebelab) {
      window.thebelab.cells.map((idx, { setOutputText }) => setOutputText());
    }
    restart().then((kernel) => {
      if (!kernel || !window.thebelab) return kernel;
      // Note, the jquery map is overridden, and is in the opposite order of native JS
      window.thebelab.cells.map((idx, { execute }) => execute());
      return kernel;
    });
  }

  let theDiv = document.createElement("div");
  $cell.append(theDiv);
  Widget.attach(outputArea, theDiv);

  const mode = $element.data("language") || "python";
  const required = {
    value: source,
    mode: mode,
    extraKeys: {
      "Shift-Enter": execute,
    },
  };

  // Gets CodeMirror config if it exists
  let codeMirrorOptions = {};
  if ("binderOptions" in mergedOptions) {
    if ("codeMirrorConfig" in mergedOptions.binderOptions) {
      codeMirrorOptions = mergedOptions.binderOptions.codeMirrorConfig;
    }
  }

  // Dynamically loads CSS for a given theme
  if ("theme" in codeMirrorOptions) {
    require(`codemirror/theme/${codeMirrorOptions.theme}.css`);
  }

  let codeMirrorConfig = Object.assign(codeMirrorOptions || {}, required);
  let cm = new CodeMirror($cm_element[0], codeMirrorConfig);
  Mode.ensure(mode).then((modeSpec) => {
    cm.setOption("mode", mode);
  });
  return { cell: $cell, execute, setOutputText };
}

export function renderAllCells({ selector = _defaultOptions.selector } = {}) {
  // render all elements matching `selector` as cells.
  // by default, this is all cells with `data-executable`

  let manager = new ThebeManager({
    loader: requireLoader,
  });

  return $(selector).map((i, cell) =>
    renderCell(cell, {
      manager: manager,
    })
  );
}

export function hookupKernel(kernel, cells) {
  // hooks up cells to the kernel
  cells.map((i, { cell }) => {
    $(cell).data("kernel-promise-resolve")(kernel);
  });
}

// requesting Kernels

export function requestKernel(kernelOptions) {
  // request a new Kernel
  kernelOptions = mergeOptions({ kernelOptions }).kernelOptions;
  let serverSettings = ServerConnection.makeSettings(
    kernelOptions.serverSettings
  );
  events.trigger("status", {
    status: "starting",
    message: "Starting Kernel",
  });
  let km = new KernelManager({ serverSettings });
  return km.ready
    .then(() => {
      return km.startNew(kernelOptions);
    })
    .then((kernel) => {
      events.trigger("status", {
        status: "ready",
        message: "Kernel is ready",
        kernel: kernel,
      });
      return kernel;
    });
}

export function requestBinderKernel({ binderOptions, kernelOptions }) {
  // request a Kernel from Binder
  // this strings together requestBinder and requestKernel.
  // returns a Promise for a running Kernel.
  return requestBinder(binderOptions).then((serverSettings) => {
    kernelOptions.serverSettings = serverSettings;
    return requestKernel(kernelOptions);
  });
}

export function requestBinder({
  repo,
  ref = "master",
  binderUrl = null,
  repoProvider = "",
  savedSession = _defaultOptions.binderOptions.savedSession,
} = {}) {
  // request a server from Binder
  // returns a Promise that will resolve with a serverSettings dict

  // populate from defaults
  let defaults = mergeOptions().binderOptions;
  if (!repo) {
    repo = defaults.repo;
    repoProvider = "";
  }
  console.log("binder url", binderUrl, defaults);
  binderUrl = binderUrl || defaults.binderUrl;
  ref = ref || defaults.ref;
  savedSession = savedSession || defaults.savedSession;
  savedSession = $.extend(true, defaults.savedSession, savedSession);

  let url;

  if (repoProvider.toLowerCase() === "git") {
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");
    //convert to URL acceptable string. Required for git
    repo = encodeURIComponent(repo);

    url = binderUrl + "/build/git/" + repo + "/" + ref;
  } else if (repoProvider.toLowerCase() === "gitlab") {
    // trim gitlab.com from repo
    repo = repo.replace(/^(https?:\/\/)?gitlab.com\//, "");
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");
    //convert to URL acceptable string. Required for gitlab
    repo = encodeURIComponent(repo);

    url = binderUrl + "/build/gl/" + repo + "/" + ref;
  } else {
    // trim github.com from repo
    repo = repo.replace(/^(https?:\/\/)?github.com\//, "");
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");

    url = binderUrl + "/build/gh/" + repo + "/" + ref;
  }
  console.log("Binder build URL", url);

  const storageKey = savedSession.storagePrefix + url;

  async function getExistingServer() {
    if (!savedSession.enabled) {
      return;
    }
    let storedInfoJSON = window.localStorage.getItem(storageKey);
    if (storedInfoJSON == null) {
      console.debug("No session saved in ", storageKey);
      return;
    }
    console.debug("Saved binder session detected");
    let existingServer = JSON.parse(storedInfoJSON);
    let lastUsed = new Date(existingServer.lastUsed);
    let ageSeconds = (new Date() - lastUsed) / 1000;
    if (ageSeconds > savedSession.maxAge) {
      console.debug(
        `Not using expired binder session for ${existingServer.url} from ${lastUsed}`
      );
      window.localStorage.removeItem(storageKey);
      return;
    }
    let settings = ServerConnection.makeSettings({
      baseUrl: existingServer.url,
      wsUrl: "ws" + existingServer.url.slice(4),
      token: existingServer.token,
      appendToken: true,
    });
    try {
      await KernelAPI.listRunning(settings);
    } catch (err) {
      console.log(
        "Saved binder connection appears to be invalid, requesting new session",
        err
      );
      window.localStorage.removeItem(storageKey);
      return;
    }
    // refresh lastUsed timestamp in stored info
    existingServer.lastUsed = new Date();
    window.localStorage.setItem(storageKey, JSON.stringify(existingServer));
    console.log(
      `Saved binder session is valid, reusing connection to ${existingServer.url}`
    );
    return settings;
  }

  return new Promise(async (resolve, reject) => {
    // if binder already spawned our server and we remember the creds
    // try to reuse it
    let existingServer;
    try {
      existingServer = await getExistingServer();
    } catch (err) {
      // catch unhandled errors such as JSON parse errors,
      // invalid formats, permission error on localStorage, etc.
      console.error("Failed to load existing server connection", err);
    }

    if (existingServer) {
      // found an existing server
      // return it instead of requesting a new one
      resolve(existingServer);
      return;
    }

    events.trigger("status", {
      status: "building",
      message: "Requesting build from binder",
    });

    let es = new EventSource(url);
    es.onerror = (err) => {
      console.error("Lost connection to " + url, err);
      es.close();
      events.trigger("status", {
        status: "failed",
        message: "Lost connection to Binder",
        error: err,
      });
      reject(new Error(err));
    };
    let phase = null;
    es.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      if (msg.phase && msg.phase !== phase) {
        phase = msg.phase.toLowerCase();
        console.log("Binder phase: " + phase);
        let status = phase;
        if (status === "ready") {
          status = "server-ready";
        }
        events.trigger("status", {
          status: status,
          message: "Binder is " + phase,
          binderMessage: msg.message,
        });
      }
      if (msg.message) {
        console.log("Binder: " + msg.message);
      }
      switch (msg.phase) {
        case "failed":
          console.error("Failed to build", url, msg);
          es.close();
          reject(new Error(msg));
          break;
        case "ready":
          es.close();
          try {
            // save the current connection url+token to reuse later
            window.localStorage.setItem(
              storageKey,
              JSON.stringify({
                url: msg.url,
                token: msg.token,
                lastUsed: new Date(),
              })
            );
          } catch (e) {
            // storage quota full, gently ignore nonfatal error
            console.warn(
              "Couldn't save thebe binder connection info to local storage",
              e
            );
          }

          resolve(
            ServerConnection.makeSettings({
              baseUrl: msg.url,
              wsUrl: "ws" + msg.url.slice(4),
              token: msg.token,
              appendToken: true,
            })
          );
          break;
        default:
        // console.log(msg);
      }
    };
  });
}

/**
 * Do it all in one go.

 * 1. load options
 * 2. run hooks
 * 3. render cells
 * 4. request a Kernel
 * 5. hook everything up

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

  // bootstrap thebelab on the page
  let cells = renderAllCells({
    selector: options.selector,
  });

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

  kernelPromise.then((kernel) => {
    // debug
    if (typeof window !== "undefined") window.thebeKernel = kernel;
    hookupKernel(kernel, cells);
  });
  if (window.thebelab) window.thebelab.cells = cells;
  return kernelPromise;
}

function splitCell(element, { inPrompt, continuationPrompt } = {}) {
  let rawText = element.text().trim();
  if (rawText.indexOf(inPrompt) == -1) {
    return element;
  }
  let cells = [];
  let cell = null;
  rawText.split("\n").map((line) => {
    line = line.trim();
    if (line.slice(0, inPrompt.length) === inPrompt) {
      // line with a prompt
      line = line.slice(inPrompt.length) + "\n";
      if (cell) {
        cell += line;
      } else {
        cell = line;
      }
    } else if (
      continuationPrompt &&
      line.slice(0, continuationPrompt.length) === continuationPrompt
    ) {
      // line with a continuation prompt
      cell += line.slice(continuationPrompt.length) + "\n";
    } else {
      // output line
      if (cell) {
        cells.push(cell);
        cell = null;
      }
    }
  });
  if (cell) {
    cells.push(cell);
  }
  // console.log("cells: ", cells);
  // clear the parent element
  element.html("");
  // add the thebe-able cells
  cells.map((cell) => {
    element.append($("<pre>").text(cell).attr("data-executable", "true"));
  });
}

function splitCellOutputPrompt(element, { outPrompt } = {}) {
  let rawText = element.text().trim();
  if (rawText.indexOf(outPrompt) == -1) {
    return element;
  }
  let cells = [];
  let cell = null;
  rawText.split("\n").map((line) => {
    line = line.trim();
    if (line.slice(0, outPrompt.length) === outPrompt) {
      // output line
      if (cell) {
        cells.push(cell);
        cell = null;
      }
    } else {
      // input line
      if (cell) {
        cell += line + "\n";
      } else {
        cell = line + "\n";
      }
    }
  });
  if (cell) {
    cells.push(cell);
  }
  // console.log("cells: ", cells);
  // clear the parent element
  element.html("");
  // add the thebe-able cells
  cells.map((cell) => {
    element.append($("<pre>").text(cell).attr("data-executable", "true"));
  });
}

export function stripPrompts(options) {
  // strip prompts from a
  $(options.selector).map((i, el) => splitCell($(el), options));
}

export function stripOutputPrompts(options) {
  // strip prompts from a
  $(options.selector).map((i, el) => splitCellOutputPrompt($(el), options));
}
