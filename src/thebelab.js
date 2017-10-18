import * as $ from "jQuery";

import * as CodeMirror from "codemirror";
import { Kernel } from "@jupyterlab/services";
import { ServerConnection } from "@jupyterlab/services";

// import { CodeCell, CodeCellModel } from "@jupyterlab/cells";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import { RenderMime, defaultRendererFactories } from "@jupyterlab/rendermime";

import "@jupyterlab/theme-light-extension/style/variables.css";
import "./index.css";

export function renderCell(element) {
  // render a single cell
  // element should be a `<pre>` tag with some code in it
  let $cell = $("<div class='thebelab-cell'/>");
  let $element = $(element);
  let source = $element.text();

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
  $cell.append(outputArea.node);

  let cm = new CodeMirror($cm_element[0], {
    value: source,
    mode: $element.data("language") || 'python3',
    extraKeys: {
      "Shift-Enter": () => {
        let kernel = $cell.data("kernel");
        if (!kernel) {
          console.error("No kernel connected");
        } else {
          outputArea.future = kernel.requestExecute({ code: cm.getValue() });
        }
        return false;
      },
    },
  });
  $cell.data("codemirror", cm);

  return $cell;
}

export function renderAllCells({
  query="[data-executable]"
}) {
  // render all elements matching `query` as cells.
  // by default, this is all cells with `data-executable`
  return $(query).map((i, cell) => renderCell(cell));
}

export function requestKernel(kernelOptions) {
  // request a new Kernel
  if (kernelOptions.serverSettings) {
    kernelOptions.serverSettings = ServerConnection.makeSettings(
      kernelOptions.serverSettings
    );
  }
  return Kernel.startNew(kernelOptions);
}

export function hookupKernel(kernel, cells) {
  // hooks up cells to the kernel
  cells.map((i, cell) => {
    $(cell).data("kernel", kernel);
  });
}

export function requestBinder(
  {
    repo,
    ref = "master",
    binderUrl = "https://beta.mybinder.org",
  } = {}
) {
  // request a server from Binder
  // returns a Promise that will resolve with a serverSettings dict

  // trim github.com from repo
  repo = repo.replace(/^(https?:\/\/)?github.com\//, "");
  // trim trailing or leading '/' on repo
  repo = repo.replace(/(^\/)|(\/?$)/g, "");
  // trailing / on binderUrl
  binderUrl = binderUrl.replace(/(\/?$)/g, "");

  let url = binderUrl + "/build/gh/" + repo + "/" + ref;
  console.log("Binder build URL", url);
  return new Promise((resolve, reject) => {
    let es = new EventSource(url);
    es.onerror = err => {
      console.error("Lost connection to " + url, err);
      es.close();
      reject(new Error(err));
    };
    es.onmessage = evt => {
      let msg = JSON.parse(evt.data);
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
