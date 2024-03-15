import type { ServiceManager } from '@jupyterlab/services';

/**
 * Example litePluginSettings shape
 * 
  {
    "litePluginSettings": {
      "@jupyterlite/pyodide-kernel-extension:kernel": {
        "pipliteUrls": ["https://unpkg.com/@jupyterlite/pyodide-kernel@0.2.3/pypi/all.json"],
        "pipliteWheelUrl": "https://unpkg.com/@jupyterlite/pyodide-kernel@0.2.3/pypi/piplite-0.2.3-py3-none-any.whl"
      }
    }
  }
 * 
 */

export type LiteServerConfig = {
  litePluginSettings: Record<string, any>;
};

export interface ThebeLiteGlobal {
  startJupyterLiteServer: (config?: LiteServerConfig) => Promise<ServiceManager>;
}
