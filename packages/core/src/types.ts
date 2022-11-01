import type { KernelSpecAPI, Session } from '@jupyterlab/services';
import type { ServerStatus } from './messaging';
import type ThebeSession from './session';
import type { IOutput } from '@jupyterlab/nbformat';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';

export type JsonObject = Record<string, any>;
export type SessionIModel = Session.IModel;
export type KernelISpecModels = KernelSpecAPI.ISpecModels;
export type KernelISpecModel = KernelSpecAPI.ISpecModel;

export interface ServerInfo {
  id: string;
  url: string;
  status: ServerStatus;
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
  useBinder?: boolean;
  useJupyterLite?: boolean;
  requestKernel?: boolean;
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

export interface MathjaxOptions {
  url?: string;
  config?: string;
}

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

  attachToDOM(el?: HTMLElement): void;
  setOutputText(text: string): void;
  clear(): void;
  clearOnError(error?: any): void;
  render(outputs: IOutput[]): void;
}

export interface IThebeCell extends IPassiveCell {
  readonly notebookId: string;
  readonly busy: boolean;
  source: string;
  session?: ThebeSession;

  attachSession(session: ThebeSession): void;
  detachSession(): void;
  execute(source?: string): Promise<{ id: string; height: number; width: number } | null>;
  messageBusy(): void;
  messageCompleted(): void;
  messageError(message: string): void;
}
