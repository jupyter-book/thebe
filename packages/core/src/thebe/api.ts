import { MessageCallback } from '../messaging';
import ThebeServer from '../server';
import ThebeSession from '../session';
import ThebeNotebook, { CodeBlock } from '../notebook';
import { Options } from '../types';
import { ensureOptions } from '../options';

export async function connect(
  options: Partial<Options>,
  messages?: MessageCallback,
): Promise<{ server: ThebeServer; session?: ThebeSession }> {
  const opts = ensureOptions(options);
  let server: ThebeServer;
  if (options.useBinder) {
    console.debug(`thebe:api:connect useBinder`, options);
    server = await ThebeServer.connectToServerViaBinder(opts, messages);
  } else if (options.useJupyterLite) {
    console.debug(`thebe:api:connect JupyterLite`, options);
    server = await ThebeServer.connectToJupyterLiteServer(messages);
  } else {
    server = await ThebeServer.connectToJupyterServer(opts, messages);
  }

  if (options.requestKernel) {
    const session = await server.requestKernel({
      name: opts.kernelOptions.name,
      path: opts.kernelOptions.path,
      kernelName: opts.kernelOptions.kernelName ?? opts.kernelOptions.name,
    });
    return { server, session };
  }

  return { server };
}

export function setupNotebook(
  blocks: CodeBlock[],
  options: Partial<Options>,
  messages?: MessageCallback,
) {
  const { mathjaxUrl, mathjaxConfig } = ensureOptions(options);
  return ThebeNotebook.fromCodeBlocks(blocks, { url: mathjaxUrl, config: mathjaxConfig }, messages);
}
