import type { ServiceManager } from '@jupyterlab/services';

export interface ThebeLiteGlobal {
  startJupyterLiteServer: () => Promise<ServiceManager>;
}
