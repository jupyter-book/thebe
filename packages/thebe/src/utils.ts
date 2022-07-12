import type { Options } from './options';

export function stripPrompts({ selector, stripPrompts }: Options) {
  // strip prompts from a cell
  document.querySelectorAll(selector).forEach((el) => {
    splitCell(el, stripPrompts);
  });
}

export function stripOutputPrompts({ selector, stripOutputPrompts }: Options) {
  // strip output prompts from a cell
  document.querySelectorAll(selector).forEach((el) => {
    splitCellOutputPrompt(el, stripOutputPrompts);
  });
}

function appendNewCell(el: Element, text: string) {
  const pre = document.createElement('pre');
  pre.setAttribute('data-executable', 'data-executable');
  pre.textContent = text;
  el.appendChild(pre);
}

function splitCell(
  el: Element,
  {
    inPrompt,
    continuationPrompt,
  }: {
    inPrompt?: string;
    continuationPrompt?: string;
  } = {}
) {
  let rawText = el.textContent?.trim() ?? '';
  if (!inPrompt || rawText.indexOf(inPrompt) == -1) {
    return el;
  }
  let listOfCellContents: string[] = [];
  let cellContents: string | null = null;
  rawText.split('\n').map((line) => {
    line = line.trim();
    if (line.slice(0, inPrompt.length) === inPrompt) {
      // line with a prompt
      line = line.slice(inPrompt.length) + '\n';
      if (cellContents) {
        cellContents += line;
      } else {
        cellContents = line;
      }
    } else if (
      continuationPrompt &&
      line.slice(0, continuationPrompt.length) === continuationPrompt
    ) {
      // line with a continuation prompt
      cellContents += line.slice(continuationPrompt.length) + '\n';
    } else {
      // output line
      if (cellContents) {
        listOfCellContents.push(cellContents);
        cellContents = null;
      }
    }
  });
  if (cellContents) {
    listOfCellContents.push(cellContents);
  }
  // clear the parent element
  el.innerHTML = '';
  // add the thebe-able cells
  listOfCellContents.forEach((cell) => appendNewCell(el, cell));
}

function splitCellOutputPrompt(el: Element, { outPrompt }: { outPrompt?: string } = {}) {
  let rawText = el.textContent?.trim() ?? '';
  if (!outPrompt || rawText.indexOf(outPrompt) == -1) {
    return el;
  }
  let listOfCellContents: string[] = [];
  let cellContents: string | null = null;
  rawText.split('\n').map((line) => {
    line = line.trim();
    if (line.slice(0, outPrompt.length) === outPrompt) {
      // output line
      if (cellContents) {
        listOfCellContents.push(cellContents);
        cellContents = null;
      }
    } else {
      // input line
      if (cellContents) {
        cellContents += line + '\n';
      } else {
        cellContents = line + '\n';
      }
    }
  });
  if (cellContents) {
    listOfCellContents.push(cellContents);
  }
  // clear the parent element
  el.innerHTML = '';
  // add the thebe-able cells
  listOfCellContents.forEach((cell) => appendNewCell(el, cell));
}

export function randomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return 'id-' + uint32.toString(8);
}
