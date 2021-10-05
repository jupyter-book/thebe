import { JupyterLiteServer } from "@jupyterlite/server";

const serverExtensions = [
  import("@jupyterlite/javascript-kernel-extension"),
  import("@jupyterlite/pyolite-kernel-extension"),
  import("@jupyterlite/server-extension"),
];

export class JupyterLiteBackend {
  constuctor() {
    this.server = new JupyterLiteServer({});
  }

  async started() {
    return this.server.started;
  }

  async start() {
    const litePluginsToRegister = [];

    // Add the base serverlite extensions
    const baseServerExtensions = await Promise.all(serverExtensions);
    baseServerExtensions.forEach((p) => {
      for (let plugin of activePlugins(p)) {
        litePluginsToRegister.push(plugin);
      }
    });

    this.server.registerPluginModules(litePluginsToRegister);
    await this.server.start();
    return this.server.serviceManager;
  }

  async stop() {
    await this.server.stop();
  }
}
