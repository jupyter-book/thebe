import $ from "jquery";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint";

import { mergeOptions } from "./options";
import * as events from "./events";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

import { Widget } from "@lumino/widgets";
import { MathJaxTypesetter } from "@jupyterlab/mathjax2";
import { OutputArea, OutputAreaModel } from "@jupyterlab/outputarea";
import {
  RenderMimeRegistry,
  standardRendererFactories,
} from "@jupyterlab/rendermime";
import { Mode } from "@jupyterlab/codemirror";

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

/**
 * Function to render (initialize) an executable thebe cell.
 * When called with a jquery element, this function will:
 *
 * - Replace that element, with a thebe-cell
 * - Insert an output element immedately after the call with an attached OutputAreaModel
 * - Render Run, Run All & Restart buttons
 * - Attach a CodeMirror Instance
 * - Return the new element and closed over functions for execution
 *
 * @param {Object} element - a jquery element containing the source code for the cell.
 * Typically this is a ``<pre>`` tag, a tag with ``<div data-executable="true" />`` or any element
 * decorated in line with the ``options.selector`` option.
 * @param {Object} options - thebe options to apply
 * @returns {object} ``reference`` - The cell reference information object
 * @returns {object} ``reference.cell`` - The jquery element for the cell
 * @returns {function} ``reference.execute`` - The function to execute the contents of this cell
 * @returns {function} ``reference.setOutputText`` - A function to render a text stream to the cell OutputArea
 */
export function renderCell(element, options) {
  // render a single cell
  // element should be a `<pre>` tag with some code in it
  let mergedOptions = mergeOptions({ options });
  let $cell = $("<div class='thebe-cell thebelab-cell'/>");
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

  $cell.data("renderMime", renderMime);

  let model = new OutputAreaModel({ trusted: true });

  let outputArea = new OutputArea({
    model: model,
    rendermime: renderMime,
  });

  $cell.attr("id", $element.attr("id"));

  $element.replaceWith($cell);

  let $cm_element = $("<div class='thebe-input thebelab-input'>");
  $cell.append($cm_element);
  if (mergedOptions.mountRunButton) {
    $cell.append(
      $(
        "<button class='thebe-button thebe-run-button thebelab-button thebelab-run-button'>"
      )
        .text("run")
        .attr("title", "run this cell")
        .click(execute)
    );
  }
  if (mergedOptions.mountRestartButton) {
    $cell.append(
      $(
        "<button class='thebe-button thebe-restart-button thebelab-button thebelab-restart-button'>"
      )
        .text("restart")
        .attr("title", "restart the kernel")
        .click(restart)
    );
  }
  if (mergedOptions.mountRestartallButton) {
    $cell.append(
      $(
        "<button class='thebe-button thebelab-button thebe-restartall-button thebelab-restartall-button'>"
      )
        .text("restart & run all")
        .attr("title", "restart the kernel and run all cells")
        .click(restartAndRunAll)
    );
  }
  $cell.append(
    $(
      "<div class='thebe-busy thebelab-busy'><div class='thebe-busy-spinner thebelab-busy-spinner'></div>"
    )
  );

  let kernelResolve, kernelReject;
  let kernelPromise = new Promise((resolve, reject) => {
    kernelResolve = resolve;
    kernelReject = reject;
  });
  kernelPromise.then((kernel) => {
    $cell.data("kernel", kernel);
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

  function clearOnError(error) {
    outputArea.model.clear();
    outputArea.model.add({
      output_type: "stream",
      name: "stderr",
      text: `Failed to execute. ${error} Please refresh the page.`,
    });
    $cell.find("div.thebe-busy").css("visibility", "hidden");
  }

  function getKernel() {
    const kernel = $cell.data("kernel");
    if (!kernel) {
      console.debug("No kernel connected");
      setOutputText();
      events.trigger("request-kernel");
    }
  }

  function execute() {
    getKernel();
    let code = cm.getValue();
    kernelPromise.then((kernel) => {
      try {
        $cell.find(".thebe-busy").css("visibility", "visible");
        outputArea.future = kernel.requestExecute({ code: code });
        outputArea.future.done.then(() => {
          $cell.find(".thebe-busy").css("visibility", "hidden");
        });
      } catch (error) {
        clearOnError(error);
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
    if (window.thebe) {
      thebe.cells.map((idx, { setOutputText }) => setOutputText());
    }
    restart().then((kernel) => {
      if (!window.thebe) return kernel;
      // Note, the jquery map is overridden, and is in the opposite order of native JS
      window.thebe.cells.map((idx, { execute }) => execute());
      return kernel;
    });
  }

  function codeCompletion() {
    getKernel();
    let code = cm.getValue();
    const cursor = cm.getDoc().getCursor();
    kernelPromise.then((kernel) => {
      try {
        kernel
          .requestComplete({
            code: code,
            cursor_pos: cm.getDoc().indexFromPos(cursor),
          })
          .then((value) => {
            const from = cm.getDoc().posFromIndex(value.content.cursor_start);
            const to = cm.getDoc().posFromIndex(value.content.cursor_end);
            cm.showHint({
              container: $cell[0],
              hint: () => {
                return {
                  from: from,
                  to: to,
                  list: value.content.matches,
                };
              },
            });
          });
      } catch (error) {
        clearOnError(error);
      }
    });
    return false;
  }

  let theDiv = document.createElement("div");
  $cell.append(theDiv);
  Widget.attach(outputArea, theDiv);

  const mode = $element.data("language") || "python";
  const isReadOnly = $element.data("readonly");
  const required = {
    value: source,
    mode: mode,
    extraKeys: {
      "Shift-Enter": execute,
      "Ctrl-Space": codeCompletion,
    },
  };
  if (isReadOnly !== undefined) {
    required.readOnly = isReadOnly !== false; //overrides codeMirrorConfig.readOnly for cell
  }

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
  if (cm.isReadOnly()) {
    cm.display.lineDiv.setAttribute("data-readonly", "true");
    $cm_element[0].setAttribute("data-readonly", "true");
    $cell.attr("data-readonly", "true");
  }
  return { cell: $cell, execute, setOutputText };
}

/**
 * Find all elements on the page that conform to the css selector provided and
 * render these as thebe cells.
 *
 * @param {Object} options - partial options object
 * @param {string} options.selector - css selector used to find code cells. By default ``_defaultOptions.selector``
 * @param {*} kernelPromise unused
 * @returns {object[]} an array of cell reference objects. See ``renderCell`` return object
 */
export function renderAllCells(
  { selector = _defaultOptions.selector } = {},
  kernelPromise
) {
  // render all elements matching `selector` as cells.
  // by default, this is all cells with `data-executable`

  return $(selector).map((i, cell) => renderCell(cell, {}));
}
