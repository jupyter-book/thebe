import * as $ from "jQuery";

import { Widget } from "@phosphor/widgets";

import { RenderMime } from "jupyterlab/lib/rendermime";
import { editorServices } from "jupyterlab/lib/codemirror";
import { CodeCellWidget, CodeCellModel } from "jupyterlab/lib/cells";
// 
// import "jupyterlab/lib/default-theme/index.css";
// import "jupyterlab/lib/default-theme/index.css";
import "jupyterlab/lib/default-theme/variables.css";
import "jupyterlab/lib/codemirror/index.css";
import "jupyterlab/lib/cells/index.css";
import "./index.css";

const editorFactory = editorServices.factoryService.newInlineEditor;
const contentFactory = new CodeCellWidget.ContentFactory({ editorFactory });

export function renderCell(element) {
  let new_element = $("<div class='thebelab-cell'/>");
  let source = $(element).text();

  let cell = new CodeCellWidget({
    model: new CodeCellModel({
      cell: {
        source,
        metadata: {},
        outputs: [
          {
            output_type: "stream",
            text: "Hello!",
          },
        ],
      },
    }),
    contentFactory,
  });

  $(element).replaceWith(new_element);
  Widget.attach(cell, new_element[0]);
  return cell;
}

export function renderAllCells() {
  return $("[data-executable]").map((i, cell) => renderCell(cell));
}
