/**
 * thebe/index.js is the entrypoint for the webpack build and will
 * be invoked on module load, seting up context with an independent store
 * and adding to the window object.
 */
import type ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import type ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import { connect, setupNotebook } from './api';
import * as coreModule from '../index';
import type { ThebeEvents } from '../index';

/**
 * This file is the main entrypoint for the cjs bundle
 * For the TS module, use setupThebeCore()
 */

export interface JsApi {
  connect: (options: Partial<CoreOptions>, events: ThebeEvents) => ThebeServer;
  setupNotebook: (
    blocks: CodeBlock[],
    options: Partial<CoreOptions>,
    events: ThebeEvents,
  ) => ThebeNotebook;
}

declare global {
  interface Window {
    define: any;
    requirejs: any;
    thebe: {
      lite?: any;
      core: {
        module: typeof coreModule;
        api: JsApi;
      };
    };
  }
}

export function setupThebeCore() {
  const core = {
    module: coreModule,
    api: { connect, setupNotebook },
  };

  if (window.thebe) window.thebe.core = core;
  else window.thebe = { core };
}

setupThebeCore();
