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
    mode: $element.data("language"),
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

export function renderAllCells() {
  return $("[data-executable]").map((i, cell) => renderCell(cell));
}

export function requestKernel(kernelOptions) {
  if (kernelOptions.serverSettings) {
    kernelOptions.serverSettings = ServerConnection.makeSettings(
      kernelOptions.serverSettings,
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
  repo,
  ref = "master",
  binderUrl = "https://beta.mybinder.org",
) {
  // TODO
}
