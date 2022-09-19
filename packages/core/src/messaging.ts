import type ThebeCell from './cell';
import type ThebeNotebook from './notebook';
import type ThebeServer from './server';
import type ThebeSession from './session';

export enum ServerStatus {
  'launching' = 'launching',
  'ready' = 'server-ready',
  'closed' = 'closed',
  'failed' = 'failed',
  'unknown' = 'unknown',
}

export enum SessionStatus {
  'starting' = 'starting',
  'ready' = 'ready',
  'dead' = 'dead',
}

export enum KernelStatus {
  'starting' = 'starting',
  'ready' = 'ready',
  'dead' = 'dead',
}

export enum NotebookStatus {
  'changed' = 'changed',
  'executing' = 'executing',
  'completed' = 'completed',
  'error' = 'error',
}

export enum CellStatus {
  'changed' = 'changed',
  'executing' = 'executing',
  'completed' = 'completed',
  'error' = 'error',
}

export enum MessageSubject {
  'server' = 'server',
  'session' = 'session',
  'kernel' = 'kernel',
  'notebook' = 'notebook',
  'cell' = 'cell',
}

export interface MessageCallbackArgs {
  subject?: MessageSubject;
  id?: string;
  status?: ServerStatus | SessionStatus | KernelStatus | NotebookStatus | CellStatus;
  message: string;
  object?: ThebeServer | ThebeSession | ThebeNotebook | ThebeCell;
}

export type MessageCallback = (args: MessageCallbackArgs) => void;
