import type { MessageCallback } from '../messaging';
import ThebeServer from '../server';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import { makeConfiguration } from '..';
import { getRenderMimeRegistry } from '../rendermime';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export async function connect(
  options: CoreOptions,
  messages?: MessageCallback,
): Promise<ThebeServer> {
  // turn any options into a configuraiton object, applies
  // defaults for any ommited options
  const config = makeConfiguration(options);

  // create a new server object
  const server: ThebeServer = new ThebeServer(config, undefined, messages);

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

export function setupNotebook(
  blocks: CodeBlock[],
  options: CoreOptions,
  rendermime?: IRenderMimeRegistry,
  messages?: MessageCallback,
) {
  const config = makeConfiguration(options);
  const { mathjaxUrl, mathjaxConfig } = config.base;
  return ThebeNotebook.fromCodeBlocks(blocks, { url: mathjaxUrl, config: mathjaxConfig }, messages);
}
