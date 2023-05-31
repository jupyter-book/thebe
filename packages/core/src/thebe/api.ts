import ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { INotebookContent } from '@jupyterlab/nbformat';
import type { Config } from '..';
import { ThebeEvents } from '../events';
import { makeConfiguration } from '../options';
import { makeRenderMimeRegistry } from '../rendermime';
import * as coreModule from '../index';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export function connectToBinder(config: Config): ThebeServer {
  const server: ThebeServer = new ThebeServer(config);
  console.debug(`thebe:api:connect binder 📡`, config.binder);
  server.connectToServerViaBinder();
  return server;
}

export function connectToJupyter(config: Config): ThebeServer {
  const server: ThebeServer = new ThebeServer(config);
  console.debug(`thebe:api:connect direct 🔌`, config.serverSettings);
  server.connectToJupyterServer();
  return server;
}

export function connectToJupyterLite(config: Config): ThebeServer {
  const server: ThebeServer = new ThebeServer(config);
  console.debug(`thebe:api:connect JupyterLite 🤘`);
  server.connectToJupyterLiteServer();
  return server;
}

export function makeEvents() {
  return new ThebeEvents();
}

export function makeServer(config: Config) {
  return new ThebeServer(config);
}

export function setupNotebookFromBlocks(
  blocks: CodeBlock[],
  config: Config,
  rendermime: IRenderMimeRegistry,
) {
  return ThebeNotebook.fromCodeBlocks(blocks, config, rendermime);
}

export function setupNotebookFromIpynb(
  ipynb: INotebookContent,
  config: Config,
  rendermime: IRenderMimeRegistry,
) {
  return ThebeNotebook.fromIpynb(ipynb, config, rendermime);
}

export function setupThebeCore() {
  console.log(`thebe:api:setupThebeCore`, { coreModule });
  window.thebeCore = Object.assign(window.thebeCore ?? {}, {
    module: coreModule,
    api: {
      makeConfiguration,
      makeEvents,
      makeServer,
      makeRenderMimeRegistry,
      connectToBinder,
      connectToJupyter,
      connectToJupyterLite,
      setupNotebookFromBlocks,
      setupNotebookFromIpynb,
    },
  });
}
