import 'codemirror/lib/codemirror.css';

import { getPageConfig, mergeOptions } from './options';
import { CellDOMItem, findCells, renderAllCells } from './render';
import { stripPrompts, stripOutputPrompts } from './utils';
import { KernelStatus } from './status';
import { ActivateWidget } from './activate';

import '@jupyterlab/theme-light-extension/style/theme.css';
import '@jupyter-widgets/controls/css/widgets-base.css';
import '@lumino/widgets/style/index.css';
import '@jupyterlab/apputils/style/base.css';
import '@jupyterlab/rendermime/style/base.css';
import '@jupyterlab/codemirror/style/base.css';
import 'thebe-core/dist/index.css';
import './index.css';
import './status.css';
import './activate.css';

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

import * as base from '@jupyter-widgets/base';
import * as controls from '@jupyter-widgets/controls';
import { output } from '@jupyter-widgets/jupyterlab-manager';
import type { Options } from './options';
import { connect, setupNotebook } from 'thebe-core';

if (typeof window !== 'undefined' && typeof window.define !== 'undefined') {
  window.define('@jupyter-widgets/base', base);
  window.define('@jupyter-widgets/controls', controls);
  window.define('@jupyter-widgets/output', output);
}

export * from './render';
export * from './options';
export * from './events';

export function mountStatusWidget() {
  window.thebe.kernelStatus = new KernelStatus();
  window.thebe.kernelStatus.mount();
}

export function mountActivateWidget() {
  window.thebe.activateButton = new ActivateWidget();
  window.thebe.activateButton.mount();
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
export async function bootstrap(opts: Partial<Options>) {
  // bootstrap thebe on the page
  // merge defaults, pageConfig, etc.
  window.thebe.options = mergeOptions(opts);

  const { options } = window.thebe;
  if (options.preRenderHook) options.preRenderHook();
  if (options.stripPrompts) stripPrompts(options);
  if (options.stripOutputPrompts) stripOutputPrompts(options);

  const { server, session } = await connect(options, ({ status, message }) => {
    console.log(`[${status}]: ${message}`);
  });

  const { selector, outputSelector } = options;
  const items: CellDOMItem[] = findCells(selector, outputSelector);

  const codeWithIds = items.map(({ id, placeholders: { source: el } }) => {
    return { id, source: el.textContent?.trim() ?? '' };
  });

  const notebook = setupNotebook(codeWithIds, options);

  renderAllCells(options, notebook, items);

  await server.ready;

  // NOTE if no session/kernel requested, caller needs to do that
  if (session) {
    notebook.attachSession(session);
  }

  if (window.thebe) {
    window.thebe.server = server;
    window.thebe.session = session;
    window.thebe.notebook = notebook;
  }

  return { server, session, notebook };
}
