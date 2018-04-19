import $ from "jquery";
import CodeMirror from "codemirror";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

import { Widget } from "@phosphor/widgets";
import { Kernel } from "@jupyterlab/services";
import { ServerConnection } from "@jupyterlab/services";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import { RenderMimeRegistry, standardRendererFactories } from "@jupyterlab/rendermime";
import { Mode } from "@jupyterlab/codemirror";

import "@jupyterlab/theme-light-extension/static/index.css";
import "./index.css";

// events

export const events = $({});
export const on = function() {
  events.on.apply(events, arguments);
};
export const one = function() {
  events.one.apply(events, arguments);
};
export const off = function() {
  events.off.apply(events, arguments);
};

// options

const _defaultOptions = {
  bootstrap: false,
  preRenderHook: false,
  stripPrompts: false,
  requestKernel: false,
  selector: "[data-executable]",
  binderOptions: {
    ref: "master",
    binderUrl: "https://mybinder.org",
  },
  kernelOptions: {},
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
function getRenderers() {
  if (!_renderers) {
    _renderers = standardRendererFactories.filter(f => {
      // filter out latex renderer if mathjax is unavailable
      if (f.mimeTypes.indexOf("text/latex") >= 0) {
        if (typeof window !== "undefined" && window.MathJax) {
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
  let $cell = $("<div class='thebelab-cell'/>");
  let $element = $(element);
  let source = $element.text().trim();

  let renderMime = new RenderMimeRegistry({
    initialFactories: getRenderers(),
  });
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
      .click(execute)
  );
  let kernelResolve, kernelReject;
  let kernelPromise = new Promise((resolve, reject) => {
    kernelResolve = resolve;
    kernelReject = reject;
  });
  kernelPromise.then(kernel => {
    $cell.data("kernel", kernel);
    return kernel;
  });
  $cell.data("kernel-promise-resolve", kernelResolve);
  $cell.data("kernel-promise-reject", kernelReject);

  function execute() {
    let kernel = $cell.data("kernel");
    let code = cm.getValue();
    if (!kernel) {
      console.error("No kernel connected");
      outputArea.model.clear();
      outputArea.model.add({
        output_type: "stream",
        name: "stdout",
        text: "Waiting for kernel...",
      });
      events.trigger("request-kernel");
    }
    kernelPromise.then(kernel => {
      outputArea.future = kernel.requestExecute({ code: code });
    });
    return false;
  }

  let theDiv = document.createElement("div");
  $cell.append(theDiv);
  Widget.attach(outputArea, theDiv);

  const mode = $element.data("language") || "python3";
  let cm = new CodeMirror($cm_element[0], {
    value: source,
    mode: mode,
    extraKeys: {
      "Shift-Enter": execute,
    },
  });
  Mode.ensure(mode).then(modeSpec => {
    cm.setOption("mode", mode);
  });
  return $cell;
}

export function renderAllCells({ selector = _defaultOptions.selector } = {}) {
  // render all elements matching `selector` as cells.
  // by default, this is all cells with `data-executable`
  return $(selector).map((i, cell) => renderCell(cell));
}

export function hookupKernel(kernel, cells) {
  // hooks up cells to the kernel
  cells.map((i, cell) => {
    $(cell).data("kernel-promise-resolve")(kernel);
  });
}

// requesting Kernels

export function requestKernel(kernelOptions) {
  // request a new Kernel
  kernelOptions = mergeOptions({ kernelOptions }).kernelOptions;
  if (kernelOptions.serverSettings) {
    kernelOptions.serverSettings = ServerConnection.makeSettings(
      kernelOptions.serverSettings
    );
  }
  events.trigger("status", {
    status: "starting",
    message: "Starting Kernel",
  });
  let p = Kernel.startNew(kernelOptions);
  p.then(kernel => {
    events.trigger("status", {
      status: "ready",
      message: "Kernel is ready",
    });
    return kernel;
  });
  return p;
}

export function requestBinderKernel({ binderOptions, kernelOptions }) {
  // request a Kernel from Binder
  // this strings together requestBinder and requestKernel.
  // returns a Promise for a running Kernel.
  return requestBinder(binderOptions).then(serverSettings => {
    kernelOptions.serverSettings = serverSettings;
    return requestKernel(kernelOptions);
  });
}

export function requestBinder({ repo, ref = "master", binderUrl = null } = {}) {
  // request a server from Binder
  // returns a Promise that will resolve with a serverSettings dict

  // populate from defaults
  let defaults = mergeOptions().binderOptions;
  repo = repo || defaults.repo;
  console.log("binder url", binderUrl, defaults);
  binderUrl = binderUrl || defaults.binderUrl;
  ref = ref || defaults.ref;

  // trim github.com from repo
  repo = repo.replace(/^(https?:\/\/)?github.com\//, "");
  // trim trailing or leading '/' on repo
  repo = repo.replace(/(^\/)|(\/?$)/g, "");
  // trailing / on binderUrl
  binderUrl = binderUrl.replace(/(\/?$)/g, "");

  let url = binderUrl + "/build/gh/" + repo + "/" + ref;
  console.log("Binder build URL", url);
  events.trigger("status", {
    status: "building",
    message: "Requesting build from binder",
  });
  return new Promise((resolve, reject) => {
    let es = new EventSource(url);
    es.onerror = err => {
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
    es.onmessage = evt => {
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
          resolve(
            ServerConnection.makeSettings({
              baseUrl: msg.url,
              token: msg.token,
            })
          );
          break;
        default:
        // console.log(msg);
      }
    };
  });
}

// do it all in one go

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
        getKernel()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  kernelPromise.then(kernel => {
    // debug
    if (typeof window !== "undefined") window.thebeKernel = kernel;
    hookupKernel(kernel, cells);
  });
}

function splitCell(element, { inPrompt, continuationPrompt } = {}) {
  let rawText = element.text().trim();
  if (rawText.indexOf(inPrompt) == -1) {
    return element;
  }
  let cells = [];
  let cell = null;
  rawText.split("\n").map(line => {
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
  cells.map(cell => {
    element.append(
      $("<pre>")
        .text(cell)
        .attr("data-executable", "true")
    );
  });
}

function splitCellOutputPrompt(
  element,
  {
    outPrompt
  } = {}
) {
  let rawText = element.text().trim();
  if (rawText.indexOf(outPrompt) == -1) {
    return element;
  }
  let cells = [];
  let cell = null;
  rawText.split("\n").map(line => {
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
  cells.map(cell => {
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
