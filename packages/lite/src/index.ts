import { startJupyterLiteServer } from './jlite';
import type { ThebeLiteGlobal } from './types';
import version from './version';

declare global {
  interface Window {
    thebeLite?: ThebeLiteGlobal;
  }
}

function setupThebeLite() {
  window.thebeLite = Object.assign(window.thebeLite ?? {}, { startJupyterLiteServer, version });
}

if (typeof window !== 'undefined') {
  console.debug('window is defined, setting up thebe-lite');
  setupThebeLite();
  console.debug(`thebe-lite (v${window.thebeLite?.version ?? 0})`, window.thebeLite);
}

export * from './types';
export { startJupyterLiteServer, setupThebeLite };
