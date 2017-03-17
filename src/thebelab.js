import * as $ from "jQuery";

import { Widget } from "@phosphor/widgets";

import { Kernel } from "@jupyterlab/services";

import { CodeCellWidget, CodeCellModel } from "jupyterlab/lib/cells";
import { editorServices } from "jupyterlab/lib/codemirror";
import { RenderMime } from "jupyterlab/lib/rendermime";

import "jupyterlab/lib/default-theme/variables.css";
import "jupyterlab/lib/codemirror/index.css";
import "jupyterlab/lib/cells/index.css";
import "jupyterlab/lib/outputarea/index.css";
import "jupyterlab/lib/renderers/index.css";
import "./index.css";

const editorFactory = editorServices.factoryService.newInlineEditor;
const contentFactory = new CodeCellWidget.ContentFactory({ editorFactory });
const rendermime = new RenderMime({ items: RenderMime.getDefaultItems() });

export function renderCell(element) {
  let new_element = $("<div class='thebelab-cell'/>");
  let source = $(element).text();

  let cell = new CodeCellWidget({
    model: new CodeCellModel({
      cell: {
        source,
        metadata: {},
        outputs: [],
      },
    }),
    contentFactory,
    rendermime,
  });

  $(element).replaceWith(new_element);
  Widget.attach(cell, new_element[0]);
  return cell;
}

export function renderAllCells() {
  return $("[data-executable]").map((i, cell) => renderCell(cell));
}

export function requestKernel(kernelOptions) {
  return Kernel.startNew(kernelOptions);
}

export function hookupKernel(kernel, cells) {
  cells.map((i, cell) => {
    $(cell.node).on("keydown", event => {
      if (event.which === 13 && event.shiftKey) {
        cell.execute(kernel);
        return false;
      }
    });
  });
}
