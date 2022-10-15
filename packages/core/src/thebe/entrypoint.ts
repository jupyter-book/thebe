/**
 * thebe/index.js is the entrypoint for the webpack build and will
 * be invoked on module load, seting up context with an independent store
 * and adding to the window object.
 */
import type ThebeServer from '../server';
import type ThebeSession from '../session';
import type { CodeBlock } from '../notebook';
import type ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import { connect, setupNotebook } from './api';

/**
 * This file is the main entrypoint for the cjs bundle
 * For the TS module, use setupThebeCore()
 */

export interface JsApi {
  connect: (options: Partial<CoreOptions>) => Promise<ThebeServer>;
  setupNotebook: (blocks: CodeBlock[], options: Partial<CoreOptions>) => ThebeNotebook;
}

declare global {
  interface Window {
    define: any;
    requirejs: any;
    thebeCore: {
      api: JsApi;
    };
  }
}

window.thebeCore = {
  ...window.thebeCore,
  api: {
    connect,
    setupNotebook,
  },
};
