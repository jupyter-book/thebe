import { startJupyterLiteServer } from './jlite';
import type { ThebeLiteBundle } from './types';

declare global {
  interface Window {
    thebe: {
      lite: ThebeLiteBundle;
    };
  }
}

if (window.thebe) window.thebe.lite = { startJupyterLiteServer };
else
  window.thebe = {
    lite: {
      startJupyterLiteServer,
    },
  };

export * from './types';
export { startJupyterLiteServer };
