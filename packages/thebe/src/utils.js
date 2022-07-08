import $ from "jquery";

export function stripPrompts(options) {
  // strip prompts from a cell
  $(options.selector).map((i, el) => splitCell($(el), options));
}

export function stripOutputPrompts(options) {
  // strip output prompts from a cell
  $(options.selector).map((i, el) => splitCellOutputPrompt($(el), options));
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
  // clear the parent element
  element.html("");
  // add the thebe-able cells
  cells.map((cell) => {
    element.append($("<pre>").text(cell).attr("data-executable", "true"));
  });
}
