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

export enum MessageSubject {
  'server' = 'server',
  'session' = 'session',
  'kernel' = 'kernel',
}

export interface MessageCallbackArgs {
  subject?: MessageSubject;
  id?: string;
  status: ServerStatus | SessionStatus | KernelStatus;
  message: string;
}

export type MessageCallback = ({ id, message }: MessageCallbackArgs) => void;
