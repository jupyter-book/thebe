import type { ServiceManager } from '@jupyterlab/services';

export interface ThebeLiteBundle {
  startJupyterLiteServer: () => Promise<ServiceManager>;
}
