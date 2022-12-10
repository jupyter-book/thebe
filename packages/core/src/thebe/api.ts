import ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import type { Config } from '..';
import { makeConfiguration, ThebeEvents } from '..';
import * as coreModule from '../index';

/**
 *
 * @category JS Bundle API
 * @param options any options supplied will override the default configuration, this can be minimal
 * @param events ThebeEvents
 * @returns ThebeServer
 */
export function connect(config: Config): ThebeServer {
  // create a new server object
  const server: ThebeServer = new ThebeServer(config);

  // connect to a resource
  if (config.base.useBinder) {
    console.debug(`thebe:api:connect useBinder`, config.base, config.binder);
    server.connectToServerViaBinder();
  } else if (config.base.useJupyterLite) {
    console.debug(`thebe:api:connect JupyterLite`, config.base);
    server.connectToJupyterLiteServer();
  } else {
    server.connectToJupyterServer();
  }

  return server;
}

export function setupNotebook(blocks: CodeBlock[], options: CoreOptions, events: ThebeEvents) {
  const config = makeConfiguration(options, events);
  return ThebeNotebook.fromCodeBlocks(blocks, config);
}

function makeEvents() {
  return new ThebeEvents();
}

export function setupThebeCore() {
  window.thebeCore = Object.assign(window.thebeCore ?? {}, {
    module: coreModule,
    api: {
      makeConfiguration,
      connect,
      setupNotebook,
      makeEvents,
    },
  });
}
