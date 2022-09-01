import type { MessageCallback } from '../messaging';
import { MessageSubject, ServerStatus } from '../messaging';
import ThebeServer from '../server';
import type ThebeSession from '../session';
import type { CodeBlock } from '../notebook';
import ThebeNotebook from '../notebook';
import type { CoreOptions } from '../types';
import { makeConfiguration } from '..';

export async function connect(
  options: CoreOptions,
  messages?: MessageCallback,
): Promise<{ server: ThebeServer; session?: ThebeSession }> {
  let server: ThebeServer;
  if (options.useBinder) {
    console.debug(`thebe:api:connect useBinder`, options);
    server = await ThebeServer.connectToServerViaBinder(options, messages);
  } else if (options.useJupyterLite) {
    console.debug(`thebe:api:connect JupyterLite`, options);
    server = await ThebeServer.connectToJupyterLiteServer({}, messages);
  } else {
    server = await ThebeServer.connectToJupyterServer(options, messages);
  }

  if (server.isReady && options.requestKernel) {
    try {
      const session = await server.requestSession({});
      return { server, session };
    } catch (err: any) {
      messages?.({
        subject: MessageSubject.server,
        status: ServerStatus.failed,
        id: server.id,
        message: `Failed to connect to server ${server.id}: ${err.message}`,
      });
    }
  }

  return { server };
}

export function setupNotebook(
  blocks: CodeBlock[],
  options: CoreOptions,
  messages?: MessageCallback,
) {
  const config = makeConfiguration(options);
  const { mathjaxUrl, mathjaxConfig } = config.base;
  return ThebeNotebook.fromCodeBlocks(blocks, { url: mathjaxUrl, config: mathjaxConfig }, messages);
}
