import type { ServiceManager } from '@jupyterlab/services';
import { PageConfig } from '@jupyterlab/coreutils';
import { JupyterLiteServer } from '@jupyterlite/server';

const serverExtensions = [import('@jupyterlite/server-extension')];

async function createModule(scope: string, module: string) {
  try {
    const factory = await (window as any)._JUPYTERLAB[scope].get(module);
    return factory();
  } catch (e) {
    console.warn(`Failed to create module: package: ${scope}; module: ${module}`);
    throw e;
  }
}

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

type LiteServerConfig = {
  federatedExtensions: Record<string, any>;
  litePluginSettings: Record<string, any>;
};

export async function startJupyterLiteServer(config?: LiteServerConfig): Promise<ServiceManager> {
  /**
   * This is sufficent to  initialise the global object?
   */
  PageConfig.getOption('');

  /**
   * Do not rely on a configuration being on the document body, accept configuration via arguments
   * and set options on the page config directly
   */
  // PageConfig.setOption(
  //   'litePluginSettings',
  //   JSON.stringify({
  //     '@jupyterlite/pyodide-kernel-extension:kernel': {
  //       pipliteUrls: ['https://unpkg.com/@jupyterlite/pyodide-kernel@0.0.6/pypi/all.json'],
  //     },
  //   }),
  // );

  /**
   * Seems like there are 4 different extensions we may want to handle
   *
   * liteExtension - essential, as these are how kernels are added
   * federatedExtension - general jupyterlab extensions
   * federatedMimeExtension - render extensions? e.g. @jupyterlab/javascript-extension, @jupyterlab/json-extension
   * federatedStyles - ?
   *
   * TODO we're not suppporting all of these yet
   */

  const litePluginsToRegister: JupyterLiteServer.IPluginModule[] = [];

  // Add the base serverlite extensions
  const baseServerExtensions = await Promise.all(serverExtensions);
  baseServerExtensions.forEach((p) => {
    for (const plugin of activePlugins(p)) {
      litePluginsToRegister.push(plugin);
    }
  });

  // TODO get federated extensions in from config argument?
  const extensions: any[] = [];

  const liteExtensionPromises: any[] = [import('@jupyterlite/pyodide-kernel-extension')];

  extensions.forEach((data) => {
    if (data.liteExtension) {
      liteExtensionPromises.push(createModule(data.name, data.extension));
      return;
    }
  });

  // Add the serverlite federated extensions.
  const federatedLiteExtensions = await Promise.allSettled(liteExtensionPromises);
  federatedLiteExtensions.forEach((p) => {
    if (p.status === 'fulfilled') {
      for (const plugin of activePlugins(p.value)) {
        litePluginsToRegister.push(plugin);
      }
    } else {
      console.error(p.reason);
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
