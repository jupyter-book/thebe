/* eslint-disable import/no-duplicates */
/**
 * thebe/index.js is the entrypoint for the webpack build and will
 * be invoked on module load, seting up context with an independent store
 * and adding to the window object.
 */
import type ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import type ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import type { Config } from '../config';
import type { ThebeEvents } from '../events';
import type { ThebeLiteGlobal } from 'thebe-lite';
import type * as coreModule from '../index';
import type { INotebookContent } from '@jupyterlab/nbformat';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { setupThebeCore } from './api';

/**
 * This file is the main entrypoint for the cjs bundle
 * For the TS module, use setupThebeCore()
 */

export interface JsApi {
  makeEvents: () => ThebeEvents;
  makeConfiguration: (options: Partial<CoreOptions>, events?: ThebeEvents) => Config;
  makeServer: (config: Config) => ThebeServer;
  makeRenderMimeRegistry: (mathjax?: coreModule.MathjaxOptions | undefined) => IRenderMimeRegistry;
  connectToBinder: (config: Config) => ThebeServer;
  connectToJupyter: (config: Config) => ThebeServer;
  connectToJupyterLite: (config: Config) => ThebeServer;
  setupNotebookFromBlocks: (
    blocks: CodeBlock[],
    config: Config,
    rendermime: IRenderMimeRegistry,
  ) => ThebeNotebook;
  setupNotebookFromIpynb: (
    ipynb: INotebookContent,
    config: Config,
    rendermime: IRenderMimeRegistry,
  ) => ThebeNotebook;
}

export type ThebeCore = typeof coreModule;

export interface ThebeCoreGlobal {
  module: ThebeCore;
  api: JsApi;
}

declare global {
  interface Window {
    define: any;
    requirejs: any;
    thebeLite?: ThebeLiteGlobal;
    thebeCore?: ThebeCoreGlobal;
  }
}

if (typeof window !== 'undefined') setupThebeCore();
