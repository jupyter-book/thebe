import $ from "jquery";
import CodeMirror from "codemirror";

import { Widget } from "@phosphor/widgets";
import { Kernel } from "@jupyterlab/services";
import { ServerConnection } from "@jupyterlab/services";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import { RenderMime, defaultRendererFactories } from "@jupyterlab/rendermime";

import "@jupyterlab/theme-light-extension/style/variables.css";
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

let _pageConfigData = undefined;
function getPageConfig(key) {
  if (!_pageConfigData) {
    _pageConfigData = {};
    $("script[type='text/x-thebe-config']").map((i, el) => {
      if (el.getAttribute("data-thebe-loaded")) {
        // already loaded
        return;
      }
      el.setAttribute("data-thebe-loaded", "true");

      $(el).attr("data-thebe-executed", "true");
      let thebeConfig = undefined;
      eval(el.textContent);
      if (thebeConfig) {
        console.log("loading thebe config", thebeConfig);
        $.extend(true, _pageConfigData, thebeConfig);
      } else {
        console.log("No thebeConfig found in ", el);
      }
    });
  }
  return _pageConfigData[key];
}

export function getOption(key, options, defaultValue) {
  let value = undefined;
  if (options) {
    value = options[key];
    if (value !== undefined) return value;
  }
  value = getPageConfig(key);
  if (value !== undefined) return value;
  return defaultValue;
}

function getBinderOptions(options) {
  let binderOptions = {
    ref: "master",
    binderUrl: "https://beta.mybinder.org",
  };
  Object.assign(binderOptions, getPageConfig("binderOptions"));
  Object.assign(binderOptions, (options || {}).binderOptions);
  return binderOptions;
}

function getKernelOptions(options) {
  let kernelOptions = {};
  Object.assign(kernelOptions, getPageConfig("kernelOptions"));
  Object.assign(kernelOptions, (options || {}).kernelOptions);
  return kernelOptions;
}

let _renderers = undefined;
function getRenderers() {
  if (!_renderers) {
    _renderers = defaultRendererFactories.filter(f => {
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

  let renderMime = new RenderMime({
    initialFactories: getRenderers(),
  });
  let model = new OutputAreaModel();

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

  function execute() {
    let kernel = $cell.data("kernel");
    if (!kernel) {
      console.error("No kernel connected");
      outputArea.model.clear();
      outputArea.model.add({
        output_type: "stream",
        name: "stderr",
        text: "Kernel isn't ready yet!",
      });
    } else {
      outputArea.future = kernel.requestExecute({ code: cm.getValue() });
    }
    return false;
  }

  let theDiv = document.createElement("div");
  $cell.append(theDiv);
  Widget.attach(outputArea, theDiv);

  let cm = new CodeMirror($cm_element[0], {
    value: source,
    mode: $element.data("language") || "python3",
    extraKeys: {
      "Shift-Enter": execute,
    },
  });
  $cell.data("codemirror", cm);

  return $cell;
}

export function renderAllCells(
  {
    selector = "[data-executable]",
  } = {}
) {
  // render all elements matching `selector` as cells.
  // by default, this is all cells with `data-executable`
  return $(selector).map((i, cell) => renderCell(cell));
}

export function hookupKernel(kernel, cells) {
  // hooks up cells to the kernel
  cells.map((i, cell) => {
    $(cell).data("kernel", kernel);
  });
}

// requesting Kernels

export function requestKernel(kernelOptions) {
  // request a new Kernel
  kernelOptions = kernelOptions || getKernelOptions();
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

export function requestBinderKernel(
  {
    binderOptions,
    kernelOptions,
  }
) {
  // request a Kernel from Binder
  // this strings together requestBinder and requestKernel.
  // returns a Promise for a running Kernel.
  return requestBinder(binderOptions).then(serverSettings => {
    kernelOptions.serverSettings = serverSettings;
    return requestKernel(kernelOptions);
  });
}

export function requestBinder(
  {
    repo,
    ref = "master",
    binderUrl = null,
  } = {}
) {
  // request a server from Binder
  // returns a Promise that will resolve with a serverSettings dict

  // populate fro defaults
  let defaults = getBinderOptions();
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

  // TODO: use a merge function once for all
  options = options || {};
  if (options.preRenderHook) {
    options.preRenderHook();
  }
  let stripPromptsOption = getOption("stripPrompts", options);
  if (stripPromptsOption) {
    stripPrompts(stripPromptsOption);
  }
  // bootstrap thebelab on the page
  let cells = renderAllCells({
    selector: getOption("cellSelector", options),
  });
  let kernelPromise;
  let binderOptions = getBinderOptions(options);
  let kernelOptions = getKernelOptions(options);
  if (binderOptions.repo) {
    kernelPromise = requestBinderKernel({
      binderOptions: binderOptions,
      kernelOptions: kernelOptions,
    });
  } else {
    kernelPromise = requestKernel(kernelOptions);
  }
  kernelPromise.then(kernel => {
    // debug
    if (typeof window !== "undefined") window.thebeKernel = kernel;
    hookupKernel(kernel, cells);
  });
}

function splitCell(
  element,
  {
    inPrompt,
    continuationPrompt,
  } = {}
) {
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
    element.append($("<pre>").text(cell).attr("data-executable", "true"));
  });
}

export function stripPrompts(options) {
  // strip prompts from a
  $(options.selector).map((i, el) => splitCell($(el), options));
}
