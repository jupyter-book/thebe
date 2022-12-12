import ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { INotebookContent } from '@jupyterlab/nbformat';
import type { Config } from '..';
import { makeConfiguration, ThebeEvents } from '..';
import * as coreModule from '../index';

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

export function setupNotebookFromBlocks(blocks: CodeBlock[], config: Config) {
  return ThebeNotebook.fromCodeBlocks(blocks, config);
}

export function setupNotebookFromIpynb(ipynb: INotebookContent, config: Config) {
  return ThebeNotebook.fromIpynb(ipynb, config);
}

export function setupThebeCore() {
  window.thebeCore = Object.assign(window.thebeCore ?? {}, {
    module: coreModule,
    api: {
      makeConfiguration,
      makeEvents,
      makeServer,
      connectToBinder,
      connectToJupyter,
      connectToJupyterLite,
      setupNotebookFromBlocks,
      setupNotebookFromIpynb,
    },
  });
}
