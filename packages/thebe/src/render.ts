import type { IThebeCell, ThebeNotebook } from 'thebe-core';
import type { Options } from './options';
import { randomId } from './utils';
import type { CellDOMItem, CellDOMPlaceholder } from './types';
import { setupCodemirror } from './codemirror';

/**
 * findCells will find cells and outputs, associating outputs with cells
 * in fifo priority
 *
 * Note: this mirrors the original thebe behaviour
 *
 * @param selector
 * @param outputSelector
 * @returns
 */
export function findCells(selector: string, outputSelector: string): CellDOMPlaceholder[] {
  const cellEls = Array.from(document.querySelectorAll(selector));
  const outputEls = Array.from(document.querySelectorAll(outputSelector));
  return cellEls.map((el, idx) => ({
    id: randomId(),
    placeholders: {
      source: el,
      output: idx < outputEls.length ? outputEls[idx] : undefined,
    },
  }));
}

function buildButton(
  parent: Element,
  classSlug: string,
  text: string,
  title: string,
  onClickCb?: () => void,
) {
  const btn = document.createElement('button');
  btn.classList.add('thebe-button', `thebe-${classSlug}-button`);
  btn.textContent = text;
  btn.setAttribute('title', title);
  btn.onclick = onClickCb ?? (() => console.debug(`thebe:${classSlug}`));
  parent.append(btn);
  return btn;
}

function buildButtonBusySpinner(parent: Element) {
  const outer = document.createElement('div');
  outer.classList.add('thebe-busy');
  outer.style.display = 'none';
  const inner = document.createElement('div');
  inner.classList.add('thebe-busy-spinner');
  outer.appendChild(inner);
  parent.append(outer);
  return outer;
}

function getButtonsBusy(id: string) {
  const cell = document.querySelector(`[data-thebe-id=${id}]`);
  const busy = cell?.getElementsByClassName('thebe-busy').item(0);
  if (!busy) return;
  return busy as HTMLElement;
}

export function setButtonsBusy(id: string) {
  const busy = getButtonsBusy(id);
  if (busy) {
    busy.style.display = 'inline-block';
  }
}

export function clearButtonsBusy(id: string) {
  setTimeout(() => {
    const busy = getButtonsBusy(id);
    if (busy) busy.style.display = 'none';
  }, 200);
}

function buildCellUI(
  options: Options,
  item: CellDOMPlaceholder,
  notebook: ThebeNotebook,
  cell: IThebeCell,
): CellDOMItem {
  console.debug(`thebe:buildCellUI CellId:${item.id}`);
  const box = document.createElement('div');
  box.classList.add('thebe-cell');
  box.setAttribute('data-thebe-id', item.id);

  console.debug(`thebe:buildCellUI building editor`);
  const editor = document.createElement('div');
  editor.classList.add('thebe-input');
  box.append(editor);

  console.debug(`thebe:buildCellUI setup CodeMirror`);
  setupCodemirror(options, item, cell, box, editor, setButtonsBusy, clearButtonsBusy);

  console.debug(`thebe:buildCellUI adding cell controls`);
  let run, runAll, restart, restartAll;

  const controls = document.createElement('div');
  controls.classList.add('thebe-controls');

  if (options.mountRunButton)
    run = buildButton(controls, 'run', 'run', 'run this cell', async () => {
      console.debug(`thebe:run:${cell.id} run`);
      setButtonsBusy(cell.id);
      await cell.execute(cell.source);
      clearButtonsBusy(cell.id);
    });

  if (options.mountRunAllButton) {
    runAll = buildButton(controls, 'runall', 'run all', 'run all cells', async () => {
      console.debug(`thebe:run:${cell.id} runall`);
      notebook.cells?.forEach(({ id }: { id: string }) => setButtonsBusy(id));
      // TODO notebook should return an array of promises, one for each cell
      // TODO return the cell id along with the each promise
      await notebook.executeAll();
      notebook.cells?.forEach(({ id }: { id: string }) => clearButtonsBusy(id));
    });
  }

  if (options.mountRestartButton) {
    restart = buildButton(controls, 'restart', 'restart', 'restart the kernel', async () => {
      console.debug(`thebe:run:${cell.id} restart`);
      await notebook.session?.kernel?.restart();
    });
  }

  if (options.mountRestartallButton) {
    restartAll = buildButton(
      controls,
      'restartall',
      'restart & run all',
      'restart the kernel and run all cells',
      async () => {
        console.debug(`thebe:run:${cell.id} runall`);
        notebook.cells?.forEach(({ id }) => setButtonsBusy(id));
        // TODO notebook should return an array of promises, one for each cell
        // TODO return the cell id along with the each promise
        await notebook.executeAll();
        notebook.cells?.forEach(({ id }) => clearButtonsBusy(id));
      },
    );
  }

  buildButtonBusySpinner(controls);
  box.append(controls);

  // no output placeholder for this cell, append a new element
  let output = item.placeholders.output;
  if (output) {
    console.debug(`thebe:buildCellUI using output placeholder`);
  } else {
    console.debug(`thebe:buildCellUI no output placeholder for this cell, append a new element`);
    output = document.createElement('div');
    output.classList.add('thebe-output');
    box.append(output);
  }

  // preserve id of original placeholder
  box.id = item.placeholders.source.id;
  item.placeholders.source.replaceWith(box);

  // this must happen after the box/host is attached
  cell.attachToDOM(output as HTMLElement);

  return {
    ...item,
    ui: {
      cell: box,
      editor,
      output,
      buttons: {
        run,
        runAll,
        restart,
        restartAll,
      },
    },
  };
}

export function renderAllCells(
  options: Options,
  notebook: ThebeNotebook,
  placeholders: CellDOMPlaceholder[],
) {
  return placeholders.map((p) => {
    const cell = notebook.getCellById(p.id);
    if (!cell) return p;
    return buildCellUI(options, p, notebook, cell);
  });
}
