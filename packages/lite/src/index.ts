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

if (typeof window !== 'undefined') {
  console.debug('window is defined, setting up thebe-lite');
  setupThebeLite();
  console.log('window.thebeLite', window.thebeLite);
}

export * from './types';
export { startJupyterLiteServer, setupThebeLite };
