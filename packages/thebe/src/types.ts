import type { CodeMirrorEditor } from '@jupyterlab/codemirror';
import type {
  ThebeEventCb,
  ThebeEvents,
  ThebeNotebook,
  ThebeServer,
  ThebeSession,
} from 'thebe-core';
import type { ActivateWidget } from './activate';
import type { Options } from './options';
import type { KernelStatus } from './status';

export interface thebe {
  mountStatusWidget: () => void;
  mountActivateWidget: () => void;
  bootstrap: (options: Partial<Options>) => Promise<any>;
  notebook?: ThebeNotebook;
  server?: ThebeServer;
  session?: ThebeSession;
  kernelStatus?: KernelStatus;
  activateButton?: ActivateWidget;
  events: ThebeEvents;
  trigger: ThebeEventCb;
  on: (event: string, cb: ThebeEventCb) => void;
  one: (event: string, cb: ThebeEventCb) => void;
  off: (event: string, cb: ThebeEventCb) => void;
}

declare global {
  interface Window {
    define: any;
    requirejs: any;
    thebe: thebe;
    thebelab: thebe;
    CodeMirror: CodeMirrorEditor;
  }
}
