import type { CodeMirrorEditor } from '@jupyterlab/codemirror';
import { ThebeNotebook, ThebeServer, ThebeSession } from 'thebe-core';
import type { ActivateWidget } from './activate';
import { ThebeEventCb, ThebeEvents } from './events';
import { Options } from './options';
import type { KernelStatus } from './status';

interface thebe {
  mountStatusWidget: () => void;
  mountActivateWidget: () => void;
  bootstrap: (options: Partial<Options>) => Promise<any>;
  options?: Options;
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
