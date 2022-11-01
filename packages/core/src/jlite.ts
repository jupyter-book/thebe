import type { ServiceManager } from '@jupyterlab/services';
import { JupyterLiteServer } from '@jupyterlite/server';

const serverExtensions = [
  import('@jupyterlite/pyolite-kernel-extension'),
  import('@jupyterlite/server-extension'),
];

export async function startJupyterLiteServer(): Promise<ServiceManager> {
  const litePluginsToRegister: JupyterLiteServer.IPluginModule[] = [];

  /**
   * Iterate over active plugins in an extension.
   */
  function* activePlugins(extension: any) {
    // Handle commonjs or es2015 modules
    let exports;
    if (Object.prototype.hasOwnProperty.call(extension, '__esModule')) {
      exports = extension.default;
    } else {
      // CommonJS exports.
      exports = extension;
    }

    const plugins = Array.isArray(exports) ? exports : [exports];
    for (const plugin of plugins) {
      yield plugin;
    }
  }

  // Add the base serverlite extensions
  const baseServerExtensions = await Promise.all(serverExtensions);
  baseServerExtensions.forEach((p) => {
    for (const plugin of activePlugins(p)) {
      litePluginsToRegister.push(plugin);
    }
  });

  // create the in-browser JupyterLite Server
  const jupyterLiteServer = new JupyterLiteServer({} as any);
  jupyterLiteServer.registerPluginModules(litePluginsToRegister);
  // start the server
  await jupyterLiteServer.start();

  const { serviceManager } = jupyterLiteServer;
  await serviceManager.ready;

  // TODO
  return serviceManager as unknown as ServiceManager;
}
