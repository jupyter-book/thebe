import type { KernelOptions, ServerSettings, SessionIModel } from './types';
import { RepoProvider } from './types';
import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from './url';
import { getExistingServer, makeStorageKey, saveServerInfo } from './sessions';
import type { ServiceManager } from '@jupyterlab/services';
import {
  KernelManager,
  KernelSpecAPI,
  ServerConnection,
  SessionManager,
} from '@jupyterlab/services';
import ThebeSession from './session';
import type { MessageCallback } from './messaging';
import { MessageSubject, ServerStatus } from './messaging';
import { startJupyterLiteServer } from './jlite';
import type { Config } from './config';
import { shortId } from './utils';

interface ServerRuntime {
  ready: Promise<void>;
  isReady: boolean;
  settings: ServerConnection.ISettings | undefined;
  shutdownSession: (id: string) => Promise<void>;
  shutdownAllSessions: () => Promise<void>;
}

interface RestAPIContentsResponse {
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
interface ServerRestAPI {
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

async function responseToJson(res: Response) {
  if (!res.ok) throw Error(`${res.status} - ${res.statusText}`);
  const json = await res.json();
  return json as RestAPIContentsResponse;
}

class ThebeServer implements ServerRuntime, ServerRestAPI {
  config: Config;
  id: string;
  sessionManager?: SessionManager;
  serviceManager?: ServiceManager; // jlite only
  private _resolveReadyFn?: (value: void | PromiseLike<void>) => void;
  private _rejectReadyFn?: (reason?: any) => void;
  private _ready: Promise<void>;
  private _messages?: MessageCallback;
  private _isDisposed: boolean;

  constructor(config: Config, id?: string, messages?: MessageCallback) {
    this.config = config;
    this.id = id ?? shortId();
    this._messages = messages;
    this._ready = new Promise((resolve, reject) => {
      this._resolveReadyFn = resolve;
      this._rejectReadyFn = reject;
    });
    this._isDisposed = false;
  }

  messages({ status, message }: { status: ServerStatus; message: string }) {
    this._messages?.({
      subject: MessageSubject.server,
      id: this.id,
      object: this,
      status,
      message,
    });
  }

  get ready() {
    return this._ready;
  }

  get isReady(): boolean {
    return this.sessionManager?.isReady ?? false;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get settings() {
    return this.sessionManager?.serverSettings;
  }

  async shutdownSession(id: string) {
    return this.sessionManager?.shutdown(id);
  }

  async shutdownAllSessions() {
    return this.sessionManager?.shutdownAll();
  }

  dispose() {
    if (this._isDisposed) return;
    this.serviceManager?.dispose();
    this.sessionManager?.dispose();

    // Implementing the flag at this level as
    this._isDisposed = true;
  }

  async startNewSession(kernelOptions?: KernelOptions): Promise<ThebeSession | null> {
    await this.ready;

    if (!this.sessionManager?.isReady) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }
    const connection = await this.sessionManager?.startNew({
      name: kernelOptions?.name ?? this.config.kernels.name,
      path: kernelOptions?.path ?? this.config.kernels.path,
      type: 'notebook',
      kernel: {
        name: kernelOptions?.kernelName ?? this.config.kernels.kernelName,
      },
    });

    return new ThebeSession(this, connection, this._messages);
  }

  async listRunningSessions(): Promise<SessionIModel[]> {
    await this.ready;
    const iter = this.sessionManager?.running();
    const models = [];
    let model;
    while ((model = iter?.next()) !== undefined) {
      models.push(model);
    }
    return models;
  }

  async refreshRunningSessions(): Promise<SessionIModel[]> {
    await this.ready;
    await this.sessionManager?.refreshRunning();
    return this.listRunningSessions();
  }

  async connectTo(model: SessionIModel) {
    await this.ready;
    if (!this.sessionManager?.isReady) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }

    const connection = this.sessionManager?.connectTo({ model });

    return new ThebeSession(this, connection, this._messages);
  }

  async clearSavedBinderSessions() {
    const url = this.sessionManager?.serverSettings?.baseUrl;
    if (url)
      window.localStorage.removeItem(makeStorageKey(this.config.savedSessions.storagePrefix, url));
  }

  /**
   * Connect to a Jupyter server directly
   *
   */
  async connectToJupyterServer(): Promise<void> {
    console.debug('thebe:api:connectToJupyterServer:serverSettings:', this.config.serverSettings);
    const serverSettings = ServerConnection.makeSettings(this.config.serverSettings);

    // ping the server to check it is alive before trying to
    // hook up services
    try {
      this.messages({
        status: ServerStatus.launching,
        message: `Checking server url`,
      });
      await ThebeServer.status(serverSettings, true);
      this.messages({
        status: ServerStatus.launching,
        message: `Server responds to pings`,
      });
      // eslint-disable-next-line no-empty
    } catch (err: any) {
      this.messages?.({
        status: ServerStatus.failed,
        message: `Server not reachable (${serverSettings.baseUrl}) - ${err}`,
      });
      this._rejectReadyFn?.(`Server not reachable (${serverSettings.baseUrl}) - ${err}`);
      return this._ready;
    }

    const kernelManager = new KernelManager({ serverSettings });
    this.messages({
      status: ServerStatus.launching,
      message: `Created KernelManager`,
    });

    this.sessionManager = new SessionManager({
      kernelManager,
      serverSettings,
    });

    this.messages({
      status: ServerStatus.ready,
      message: `Created SessionManager`,
    });

    // Resolve the ready promise
    this.sessionManager.ready.then(() => {
      this.messages({
        status: ServerStatus.ready,
        message: `Server connection ready`,
      });
      this._resolveReadyFn?.();
    });

    return this._ready;
  }

  /**
   * Connect to Jupyterlite Server
   */
  async connectToJupyterLiteServer(): Promise<void> {
    this.messages({
      status: ServerStatus.launching,
      message: `Connecting to JupyterLite`,
    });

    const serviceManager = await startJupyterLiteServer();

    this.messages({
      status: ServerStatus.launching,
      message: `Started JupyterLite server`,
    });

    console.debug(
      'thebe:api:connectToJupyterLiteServer:serverSettings:',
      serviceManager.serverSettings,
    );

    this.sessionManager = serviceManager.sessions;

    this.messages({
      status: ServerStatus.launching,
      message: `Received SessionMananger from JupyterLite`,
    });

    this.sessionManager.ready.then(() => {
      this.messages({
        status: ServerStatus.ready,
        message: `Server connection established`,
      });
      this._resolveReadyFn?.();
    });

    return this._ready;
  }

  /**
   * Connect to a Binder instance in order to
   * access a Jupyter server that can provide kernels
   *
   * @param ctx
   * @param opts
   * @returns
   */
  async connectToServerViaBinder(): Promise<void> {
    // request new server
    console.debug('thebe:server:connectToServerViaBinder binderUrl:', this.config.binder.binderUrl);
    this.messages({
      status: ServerStatus.launching,
      message: `Connecting to binderhub at ${this.config.binder.binderUrl}`,
    });

    let url: string;
    switch (this.config.binder.repoProvider) {
      case RepoProvider.git:
        url = makeGitUrl(this.config.binder);
        break;
      case RepoProvider.gitlab:
        url = makeGitLabUrl(this.config.binder);
        break;
      case RepoProvider.github:
      default:
        url = makeGitHubUrl(this.config.binder);
        break;
    }
    console.debug('thebe:server:connectToServerViaBinder Binder build URL:', url);
    this.messages({
      status: ServerStatus.launching,
      message: `Binder build url is ${url}`,
    });

    if (this.config.savedSessions.enabled) {
      console.debug('thebe:server:connectToServerViaBinder Checking for saved session...');
      // the follow function will ping the server based on the settings and only return
      // non-null if the server is still alive. So highly likely that the remainder of
      // the connection calls below, work.
      const existingSettings = await getExistingServer(this.config.savedSessions, url);
      if (existingSettings) {
        this.messages({
          status: ServerStatus.launching,
          message: 'Found existing binder session, attempting to connect...',
        });

        const serverSettings = ServerConnection.makeSettings(existingSettings);

        // ping the server to check it is alive before trying to
        // hook up services
        try {
          await ThebeServer.status(serverSettings, true);
          this.messages({
            status: ServerStatus.launching,
            message: `Server responds to pings`,
          });
          // eslint-disable-next-line no-empty
        } catch (err: any) {
          this.messages?.({
            status: ServerStatus.failed,
            message: `Server not reachable (${serverSettings.baseUrl})`,
          });
          this._rejectReadyFn?.(`Server not reachable (${serverSettings.baseUrl}) - ${err}`);
          return this._ready;
        }

        const kernelManager = new KernelManager({ serverSettings });

        this.messages({
          status: ServerStatus.launching,
          message: `Created KernelManager`,
        });

        this.sessionManager = new SessionManager({
          kernelManager,
          serverSettings,
        });

        this.messages({
          status: ServerStatus.launching,
          message: `Created KernelManager`,
        });

        return this.sessionManager.ready.then(() => {
          this.messages?.({
            status: ServerStatus.ready,
            message: `Re-connected to binder server`,
          });
        });
      }
    }

    const requestPromise: Promise<void> = new Promise((resolveRequest, rejectRequest) => {
      // Talk to the binder server
      const state = { status: ServerStatus.launching };
      const es = new EventSource(url);
      this.messages({
        status: state.status,
        message: `Opened connection to binder: ${url}`,
      });

      // handle errors
      es.onerror = (evt: Event) => {
        console.error(`Lost connection to binder: ${url}`, evt);
        es?.close();
        state.status = ServerStatus.failed;
        this.messages({
          status: state.status,
          message: (evt as MessageEvent)?.data,
        });
        rejectRequest(evt);
      };

      es.onmessage = async (evt: MessageEvent<string>) => {
        const msg: {
          // TODO must be in Jupyterlab types somewhere
          phase: string;
          message: string;
          url: string;
          token: string;
        } = JSON.parse(evt.data);

        const phase = msg.phase?.toLowerCase() ?? '';
        switch (phase) {
          case 'failed':
            es?.close();
            state.status = ServerStatus.failed;
            this.messages({
              status: state.status,
              message: `Binder: failed to build - ${url} - ${msg.message}`,
            });
            rejectRequest(msg);
            break;
          case 'ready':
            {
              es?.close();

              const settings: ServerSettings = {
                baseUrl: msg.url,
                wsUrl: 'ws' + msg.url.slice(4),
                token: msg.token,
                appendToken: true,
              };

              const serverSettings = ServerConnection.makeSettings(settings);
              const kernelManager = new KernelManager({ serverSettings });
              this.sessionManager = new SessionManager({
                kernelManager,
                serverSettings,
              });

              if (this.config.savedSessions.enabled) {
                saveServerInfo(this.config.savedSessions, url, this.id, serverSettings);
                console.debug(
                  `thebe:server:connectToServerViaBinder Saved session for ${this.id} at ${url}`,
                );
              }

              // promise has already been returned to the caller
              // so we can await here
              await this.sessionManager.ready;

              state.status = ServerStatus.ready;
              this.messages({
                status: state.status,
                message: `Binder server is ready: ${msg.message}`,
              });

              resolveRequest();
            }
            break;
          default:
            this.messages({
              status: state.status,
              message: `Binder is: ${phase} - ${msg.message}`,
            });
        }
      };
    });

    requestPromise
      .then(() => {
        this._resolveReadyFn?.();
      })
      .catch(() => {
        this._rejectReadyFn?.();
      });

    return this._ready;
  }

  //
  // ServerRestAPI Implementation
  //
  getFetchUrl(relativeUrl: string) {
    // TODO use ServerConnection.makeRequest - this willadd the token
    // and use any internal fetch overrides
    const settings = this.config.serverSettings;
    const url = new URL(relativeUrl, settings.baseUrl);
    url.searchParams.append('token', settings.token);
    return url;
  }

  static async status(serverSettings: Required<ServerSettings>, throwOnError = true) {
    try {
      const status = await ServerConnection.makeRequest(
        `${serverSettings.baseUrl}api/status`,
        {},
        ServerConnection.makeSettings(serverSettings),
      );
      return status;
    } catch (err: any) {
      console.debug('thebe:api:connectToJupyterServer:', 'server unreachable');
      if (throwOnError) throw Error(`Jupyter server unreachable ${err?.message}`);
    }
  }

  async getKernelSpecs() {
    return KernelSpecAPI.getSpecs(ServerConnection.makeSettings(this.config.serverSettings));
  }

  async getContents(opts: {
    path: string;
    type?: 'notebook' | 'file' | 'directory';
    format?: 'text' | 'base64';
    returnContent?: boolean;
  }) {
    const url = this.getFetchUrl(`/api/contents/${opts.path}`);
    if (opts.type) url.searchParams.append('type', opts.type);
    if (opts.format) url.searchParams.append('format', opts.format);
    url.searchParams.append('content', opts.returnContent ? '1' : '0');
    return responseToJson(await fetch(url));
  }

  async duplicateFile(opts: {
    path: string;
    copy_from: string;
    ext?: string;
    type?: 'notebook' | 'file';
  }) {
    const url = this.getFetchUrl(`/api/contents/${opts.path}`);
    const { copy_from, ext, type } = opts;
    return responseToJson(
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ copy_from, ext, type }),
      }),
    );
  }

  async createDirectory(opts: { path: string }) {
    const url = this.getFetchUrl(`/api/contents/${opts.path}`);
    return responseToJson(
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'directory' }),
      }),
    );
  }

  async renameContents(opts: { path: string; newPath: string }) {
    const { path, newPath } = opts;
    const url = this.getFetchUrl(`/api/contents/${path}`);
    return responseToJson(
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath }),
      }),
    );
  }

  async uploadFile(opts: {
    path: string;
    content: string;
    format?: 'json' | 'text' | 'base64';
    type?: 'notebook' | 'file';
  }) {
    const { path, content, format, type } = opts;
    const url = this.getFetchUrl(`/api/contents/${path}`);
    return responseToJson(
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          content,
          format: format ?? 'json',
          type: type ?? 'notebook',
        }),
      }),
    );
  }
}

export default ThebeServer;
