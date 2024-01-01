import { defaultOutputSelector, defaultSelector, mergeOptions } from './options';
import { findCells, renderAllCells } from './render';
import { stripPrompts, stripOutputPrompts } from './utils';
import { KernelStatus } from './status';
import { ActivateWidget } from './activate';

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

import * as base from '@jupyter-widgets/base';
import * as controls from '@jupyter-widgets/controls';
import { output } from '@jupyter-widgets/jupyterlab-manager';
import type { Options } from './options';
import {
  makeConfiguration,
  makeRenderMimeRegistry,
  setupNotebookFromBlocks,
  ThebeServer,
} from 'thebe-core';
import type { CellDOMPlaceholder } from './types';

if (typeof window !== 'undefined' && typeof window.define !== 'undefined') {
  window.define('@jupyter-widgets/base', base);
  window.define('@jupyter-widgets/controls', controls);
  window.define('@jupyter-widgets/output', output);
}

export * from './render';
export {
  Options,
  mergeOptions,
  getPageConfig,
  getPageConfigValue,
  ensurePageConfigLoaded,
} from './options';
export * from './utils';

export function mountStatusWidget() {
  window.thebe.kernelStatus = new KernelStatus();
  window.thebe.kernelStatus.mount();
}

export function mountActivateWidget(options: Options = {}) {
  window.thebe.activateButton = new ActivateWidget(options);
  window.thebe.activateButton.mount();
}

/*
* detect new code cells
*/
export async function newCells(opts: Partial<Options> = {}) {
  // bootstrap thebe on the page
  // merge defaults, pageConfig, etc.
  const options = mergeOptions({ useBinder: true, requestKernel: true, ...opts });

  if (options.preRenderHook) options.preRenderHook();
  if (options.stripPrompts) stripPrompts(options);
  if (options.stripOutputPrompts) stripOutputPrompts(options);

  const { selector, outputSelector } = options;
  const items: CellDOMPlaceholder[] = findCells(
    selector ?? defaultSelector,
    outputSelector ?? defaultOutputSelector,
  );

  const codeWithIds = items.map(({ id, placeholders: { source: el } }) => {
    return { id, source: el.textContent?.trim() ?? '' };
  });

  const config = makeConfiguration(options, window.thebe.events);
  if( window.thebe.session == undefined || window.thebe.notebook == undefined || window.thebe.notebook?.cells.length < 1 ){
    bootstrap(opts);
  }

  const notebook = setupNotebookFromBlocks(codeWithIds, config, window.thebe.notebook!.rendermime);
  const session = window.thebe.notebook!.cells[0].session;
  notebook.cells.forEach((cell) => {
    cell.session = session;
    window.thebe.notebook?.cells.push(cell);
  })

  renderAllCells(options, window.thebe.notebook!, items);
}

/*
* detect new code cells and delete all old cells from notebook.cells
*/
export async function replaceCells(opts: Partial<Options> = {}) {
  // bootstrap thebe on the page
  // merge defaults, pageConfig, etc.
  const options = mergeOptions({ useBinder: true, requestKernel: true, ...opts });

  if (options.preRenderHook) options.preRenderHook();
  if (options.stripPrompts) stripPrompts(options);
  if (options.stripOutputPrompts) stripOutputPrompts(options);

  const { selector, outputSelector } = options;
  const items: CellDOMPlaceholder[] = findCells(
    selector ?? defaultSelector,
    outputSelector ?? defaultOutputSelector,
  );

  const codeWithIds = items.map(({ id, placeholders: { source: el } }) => {
    return { id, source: el.textContent?.trim() ?? '' };
  });

  const config = makeConfiguration(options, window.thebe.events);

  if( window.thebe.session == undefined || window.thebe.notebook == undefined || window.thebe.notebook?.cells.length < 1 ){
    bootstrap(opts);
  }
  const notebook = setupNotebookFromBlocks(codeWithIds, config, window.thebe.notebook!.rendermime);
  const session = window.thebe.notebook!.cells[0].session;
  window.thebe.notebook!.cells = [];
  notebook.cells.forEach((cell) => {
    cell.session = session;
    window.thebe.notebook?.cells.push(cell);
  })

  renderAllCells(options, window.thebe.notebook!, items);
}

/**
 * Bootstrap the library based on the configuration given.
 *
 * If bootstrap === true in the configuration and the library is loaded statically
 * then this function will be called automatically on the document load event.
 *
 * @param {Object} options Object containing thebe options.
 * Same structure as x-thebe-options.
 * @returns {Promise} Promise for connected Kernel object
 */
export async function bootstrap(opts: Partial<Options> = {}) {
  // bootstrap thebe on the page
  // merge defaults, pageConfig, etc.
  const options = mergeOptions({ useBinder: true, requestKernel: true, ...opts });

  if (options.preRenderHook) options.preRenderHook();
  if (options.stripPrompts) stripPrompts(options);
  if (options.stripOutputPrompts) stripOutputPrompts(options);

  const { selector, outputSelector } = options;
  const items: CellDOMPlaceholder[] = findCells(
    selector ?? defaultSelector,
    outputSelector ?? defaultOutputSelector,
  );

  const codeWithIds = items.map(({ id, placeholders: { source: el } }) => {
    return { id, source: el.textContent?.trim() ?? '' };
  });

  const config = makeConfiguration(options, window.thebe.events);
  const rendermime = makeRenderMimeRegistry(config.mathjax);

  const notebook = setupNotebookFromBlocks(codeWithIds, config, rendermime);
  window.thebe.notebook = notebook;

  renderAllCells(options, notebook, items);

  // starting to talk to binder / server is deferred until here so that any page
  // errors cause failure first

  const server = new ThebeServer(config);

  // connect to a resource
  if (options.useBinder) {
    console.debug(`thebe:api:connect useBinder`, config.base, config.binder);
    server.connectToServerViaBinder();
  } else if (options.useJupyterLite) {
    console.debug(`thebe:api:connect JupyterLite`, config.base);
    server.connectToJupyterLiteServer();
  } else {
    server.connectToJupyterServer();
  }

  window.thebe.server = server;

  if (!opts.requestKernel) {
    return { server, notebook };
  }

  await server.ready;

  const session = await server.startNewSession(rendermime);
  if (session != null) notebook.attachSession(session);

  window.thebe.session = session ?? undefined;

  return {
    server,
    session,
    notebook,
  };
}
