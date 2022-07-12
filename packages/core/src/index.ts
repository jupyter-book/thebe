import '@jupyterlab/theme-light-extension/style/theme.css';
import '@jupyter-widgets/controls/css/widgets-base.css';
import '@lumino/widgets/style/index.css';
import '@jupyterlab/apputils/style/base.css';
import '@jupyterlab/rendermime/style/base.css';
import { connect, setupNotebook } from './thebe/api';

export { default as ThebeServer } from './server';
export { default as ThebeSession } from './session';
export { default as ThebeNotebook } from './notebook';
export { default as ThebeCell } from './cell';
export { default as PassiveCellRenderer } from './passive';

export * from './options';
export * from './types';
export * from './thebe/api';

export function setupThebeCore() {
  window.thebeCore = {
    ...window.thebeCore,
    api: {
      connect,
      setupNotebook,
    },
  };
}
