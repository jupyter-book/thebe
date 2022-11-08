import ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import type { ThebeEvents } from '..';
import { makeConfiguration } from '..';

export function connect(options: CoreOptions, events: ThebeEvents): ThebeServer {
  // turn any options into a configuraiton object, applies
  // defaults for any ommited options
  const config = makeConfiguration(options, events);

  // create a new server object
  const server: ThebeServer = new ThebeServer(config);

  // connect to a resource
  if (options.useBinder) {
    console.debug(`thebe:api:connect useBinder`, options);
    server.connectToServerViaBinder();
  } else if (options.useJupyterLite) {
    console.debug(`thebe:api:connect JupyterLite`, options);
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
