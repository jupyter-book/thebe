import type ThebeCell from './cell';
import type ThebeNotebook from './notebook';
import type ThebeServer from './server';
import type ThebeSession from './session';
import type { IError } from '@jupyterlab/nbformat';

// value of some of these enums are not arbitrary
// but relate to events sent from the server via the
// event stream
export enum ServerStatusEvent {
  'launching' = 'launching',
  'ready' = 'server-ready',
  'closed' = 'closed',
  'unknown' = 'unknown',
}

export enum SessionStatusEvent {
  'starting' = 'starting',
  'ready' = 'ready',
  'shutdown' = 'shutdown',
}

export enum KernelStatusEvent {
  'starting' = 'starting',
  'ready' = 'ready',
  'shutdown' = 'shutdown',
}

export enum NotebookStatusEvent {
  'attached' = 'attached',
  'detached' = 'detached',
  'executing' = 'executing',
  'idle' = 'idle',
}

export enum CellStatusEvent {
  'attached' = 'attached',
  'detached' = 'detached',
  'executing' = 'executing',
  'idle' = 'idle',
}

export enum EventSubject {
  'server' = 'server',
  'session' = 'session',
  'kernel' = 'kernel',
  'notebook' = 'notebook',
  'cell' = 'cell',
}

// TODO improve typing around status's
export enum ErrorStatusEvent {
  'warning' = 'warning',
  'executeError' = 'execute-error',
  'error' = 'error',
}

export function errorToMessage(json: IError): string {
  if (!json.traceback) {
    return json.evalue;
  } else if (Array.isArray(json.traceback)) {
    return `${json.evalue}\n${(json.traceback ?? []).join('')}`;
  } else {
    return `${json.evalue}\n${JSON.stringify(json.traceback)}`;
  }
}

export enum ThebeEventType {
  'status' = 'status',
  'error' = 'error',
}

export type EventObject = ThebeServer | ThebeSession | ThebeNotebook | ThebeCell;

export type StatusEvent =
  | ServerStatusEvent
  | SessionStatusEvent
  | NotebookStatusEvent
  | CellStatusEvent
  | KernelStatusEvent
  | ErrorStatusEvent;

export interface ThebeEventData {
  subject?: EventSubject;
  id?: string;
  status?: StatusEvent;
  message: string;
  object?: EventObject;
}

export type ThebeEventCb = (event: string, data: ThebeEventData) => void;

export class ThebeEvents {
  listeners: Record<string, Map<ThebeEventCb, { unbind: boolean }>>;

  constructor() {
    this.listeners = {};
  }

  _ensureMap(event: string) {
    if (!(event in this.listeners)) this.listeners[event] = new Map();
  }

  trigger(event: ThebeEventType, evt: ThebeEventData) {
    if (!(event in this.listeners)) return;
    this.listeners[event].forEach(({ unbind }, cb) => {
      cb(event, evt);
      if (unbind) this.listeners[event].delete(cb);
    });
  }

  on(event: ThebeEventType, cb: ThebeEventCb) {
    this._ensureMap(event);
    this.listeners[event].set(cb, { unbind: false });
    return () => this.off(event, cb);
  }

  one(event: ThebeEventType, cb: ThebeEventCb) {
    this._ensureMap(event);
    this.listeners[event].set(cb, { unbind: true });
    return () => this.off(event, cb);
  }

  off(event: ThebeEventType, cb: ThebeEventCb) {
    if (!(event in this.listeners)) return;
    this.listeners[event].delete(cb);
  }
}
