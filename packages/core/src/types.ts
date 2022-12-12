import type { KernelSpecAPI, ServerConnection, Session } from '@jupyterlab/services';
import type ThebeSession from './session';
import type { IOutput } from '@jupyterlab/nbformat';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type ThebeServer from './server';
import type { ServerStatusEvent } from './events';

export type JsonObject = Record<string, any>;
export type SessionIModel = Session.IModel;
export type KernelISpecModels = KernelSpecAPI.ISpecModels;
export type KernelISpecModel = KernelSpecAPI.ISpecModel;

export interface ServerInfo {
  id: string;
  url: string;
  status: ServerStatusEvent;
  message: string;
  settings: ServerSettings | null;
  specs: KernelSpecAPI.ISpecModels;
}

export interface SavedSessionInfo {
  id: string;
  baseUrl: string;
  token: string;
  wsUrl: string;
  lastUsed: Date;
}

export interface CoreOptions {
  mathjaxUrl?: string;
  mathjaxConfig?: string;
  binderOptions?: BinderOptions;
  savedSessionOptions?: SavedSessionOptions;
  kernelOptions?: KernelOptions;
  serverSettings?: ServerSettings;
}

export enum RepoProvider {
  'git' = 'git',
  'github' = 'github',
  'gitlab' = 'gitlab',
  'gist' = 'gist',
}

export type MathjaxOptions = Pick<CoreOptions, 'mathjaxConfig' | 'mathjaxUrl'>;

export interface SavedSessionOptions {
  enabled?: boolean;
  maxAge?: number;
  storagePrefix?: string;
}

export interface BinderOptions {
  repo?: string;
  ref?: string;
  binderUrl?: string;
  repoProvider?: RepoProvider;
}

export interface ServerSettings {
  baseUrl?: string;
  token?: string;
  appendToken?: boolean;
  wsUrl?: string;
}

export interface KernelOptions {
  name?: string;
  kernelName?: string;
  path?: string;
}

export interface IPassiveCell {
  readonly id: string;
  readonly rendermime: IRenderMimeRegistry;
  readonly isAttachedToDOM: boolean;
  readonly outputs: IOutput[];

  attachToDOM(el?: HTMLElement): void;
  setOutputText(text: string): void;
  clear(): void;
  clearOnError(error?: any): void;
  render(outputs: IOutput[]): void;
}

export interface IThebeCell extends IPassiveCell {
  source: string;
  session?: ThebeSession;
  metadata: JsonObject;
  readonly notebookId: string;
  readonly isBusy: boolean;
  readonly isAttached: boolean;
  readonly tags: string[];

  attachSession(session: ThebeSession): void;
  detachSession(): void;
  execute(source?: string): Promise<IThebeCellExecuteReturn | null>;
  setAsBusy(): void;
  setAsIdle(): void;
}

export interface IThebeCellExecuteReturn {
  id: string;
  height: number;
  width: number;
  error: boolean;
}

export interface ServerRuntime {
  ready: Promise<ThebeServer>;
  isReady: boolean;
  settings: ServerConnection.ISettings | undefined;
  shutdownSession: (id: string) => Promise<void>;
  shutdownAllSessions: () => Promise<void>;
}

export interface RestAPIContentsResponse {
  content: string | null;
  created: string;
  format: string;
  last_modified: string;
  mimetype: string;
  name: string;
  path: string;
  size: number;
  type: string;
  writable: boolean;
}

// https://jupyter-server.readthedocs.io/en/latest/developers/rest-api.html#get--api-contents-path
export interface ServerRestAPI {
  getContents: (opts: {
    path: string;
    type?: 'notebook' | 'file' | 'directory';
    format?: 'text' | 'base64';
    returnContent?: boolean;
  }) => Promise<RestAPIContentsResponse>;
  duplicateFile: (opts: {
    path: string;
    copy_from: string;
    ext?: string;
    type?: 'notebook' | 'file';
  }) => Promise<RestAPIContentsResponse>;
  renameContents: (opts: { path: string; newPath: string }) => Promise<RestAPIContentsResponse>;
  uploadFile: (opts: {
    path: string;
    content: string;
    format?: 'json' | 'text' | 'base64';
    type?: 'notebook' | 'file';
  }) => Promise<RestAPIContentsResponse>;
  createDirectory: (opts: { path: string }) => Promise<RestAPIContentsResponse>;
  getKernelSpecs: () => Promise<KernelSpecAPI.ISpecModels>;
}
