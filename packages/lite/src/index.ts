import { startJupyterLiteServer } from './jlite';
import type { ThebeLiteGlobal } from './types';

declare global {
  interface Window {
    thebeLite?: ThebeLiteGlobal;
  }
}

function setupThebeLite() {
  window.thebeLite = Object.assign(window.thebeLite ?? {}, { startJupyterLiteServer });
}

export * from './types';
export { startJupyterLiteServer, setupThebeLite };
