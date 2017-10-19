import $ from "jQuery";
import CodeMirror from "codemirror";

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
  // from jupyterlab coreutils.PageConfig
  if (!_pageConfigData) {
    let el = document.getElementById("thebe-config-data");
    if (el) {
      _pageConfigData = JSON.parse(el.textContent || "{}");
    }
  }
  return (_pageConfigData || {})[key];
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

// rendering cells

function renderCell(element, options) {
  // render a single cell
  // element should be a `<pre>` tag with some code in it
  let $cell = $("<div class='thebelab-cell'/>");
  let $element = $(element);
  let source = $element.text().trim();

  let renderMime = new RenderMime({
    initialFactories: defaultRendererFactories,
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
  window.oa = outputArea;
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

  $cell.append(outputArea.node);

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

  options = options || {};
  // bootstrap thebelab on the page
  let cells = renderAllCells(getOption("thebeCellSelector", options));
  let kernelPromise;

  let binderOptions = getBinderOptions();
  if (binderOptions.repo) {
    kernelPromise = requestBinderKernel({
      binderOptions: binderOptions,
      kernelOptions: getKernelOptions(options),
    });
  } else {
    kernelPromise = requestKernel(getKernelOptions(options));
  }
  kernelPromise.then(kernel => {
    // debug
    window.thebeKernel = kernel;
    hookupKernel(kernel, cells);
  });
}
