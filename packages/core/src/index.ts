import { connect, setupNotebook } from './thebe/api';

export { default as ThebeServer } from './server';
export { default as ThebeSession } from './session';
export { default as ThebeNotebook, CodeBlock } from './notebook';
export { default as ThebeCell } from './cell';
export { default as PassiveCellRenderer } from './passive';

export * from './options';
export * from './messaging';
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
