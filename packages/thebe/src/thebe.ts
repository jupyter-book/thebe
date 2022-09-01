import { defaultOutputSelector, defaultSelector, mergeOptions } from './options';
import type { CellDOMPlaceholder } from './render';
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
import { connect, setupNotebook } from 'thebe-core';
import * as events from './events';
import type { MessageCallbackArgs } from 'thebe-core/dist/types/messaging';

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
export * from './events';
export * from './utils';

export function mountStatusWidget() {
  window.thebe.kernelStatus = new KernelStatus();
  window.thebe.kernelStatus.mount();
}

export function mountActivateWidget() {
  window.thebe.activateButton = new ActivateWidget();
  window.thebe.activateButton.mount();
}

function messageCallback({ id, subject, status, message }: MessageCallbackArgs) {
  events.trigger('status', { id, subject, status, message });
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
  const { server, session } = await connect(options, messageCallback);

  const { selector, outputSelector } = options;
  const items: CellDOMPlaceholder[] = findCells(
    selector ?? defaultSelector,
    outputSelector ?? defaultOutputSelector,
  );

  const codeWithIds = items.map(({ id, placeholders: { source: el } }) => {
    return { id, source: el.textContent?.trim() ?? '' };
  });

  const notebook = setupNotebook(codeWithIds, options, messageCallback);

  renderAllCells(options, notebook, items);

  await server.ready;

  // NOTE if no session/kernel requested, caller needs to do that
  if (session) {
    notebook.attachSession(session);
  }

  if (window.thebe) {
    window.thebe.options = options;
    window.thebe.server = server;
    window.thebe.session = session;
    window.thebe.notebook = notebook;
  }

  return { server, session, notebook };
}
