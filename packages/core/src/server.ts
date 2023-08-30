import type {
  KernelOptions,
  RestAPIContentsResponse,
  ServerRestAPI,
  ServerRuntime,
  ServerSettings,
  SessionIModel,
} from './types';
import type { Config } from './config';
import type { ServiceManager } from '@jupyterlab/services';
import type { LiteServerConfig } from 'thebe-lite';
import type { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import type { StatusEvent } from './events';
import { WellKnownRepoProvider } from './types';
import { makeBinderUrl } from './url';
import { getExistingServer, makeStorageKey, saveServerInfo } from './sessions';
import {
  KernelManager,
  KernelSpecAPI,
  ServerConnection,
  SessionManager,
} from '@jupyterlab/services';
import ThebeSession from './session';
import { shortId } from './utils';
import { ServerStatusEvent, EventSubject, ErrorStatusEvent } from './events';
import { EventEmitter } from './emitter';

async function responseToJson(res: Response) {
  if (!res.ok) throw Error(`${res.status} - ${res.statusText}`);
  const json = await res.json();
  return json as RestAPIContentsResponse;
}

class ThebeServer implements ServerRuntime, ServerRestAPI {
  readonly id: string;
  readonly config: Config;
  readonly ready: Promise<ThebeServer>;
  sessionManager?: SessionManager;
  serviceManager?: ServiceManager; // jlite only
  private resolveReadyFn?: (value: ThebeServer | PromiseLike<ThebeServer>) => void;
  private _isDisposed: boolean;
  private events: EventEmitter;

  constructor(config: Config) {
    this.id = shortId();
    this.config = config;
    this.events = new EventEmitter(this.id, config, EventSubject.server, this);
    this.ready = new Promise((resolve) => {
      this.resolveReadyFn = resolve;
    });
    this._isDisposed = false;
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
    if (!this.serviceManager?.isDisposed) this.serviceManager?.dispose();
    if (!this.sessionManager?.isDisposed) this.sessionManager?.dispose();

    // Implementing the flag at this level as
    this._isDisposed = true;
  }

  async startNewSession(
    rendermime: IRenderMimeRegistry,
    kernelOptions?: KernelOptions,
  ): Promise<ThebeSession | null> {
    await this.ready;

    if (!this.sessionManager?.isReady) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }

    // name is assumed to be a non empty string but is otherwise note required
    // if a notebook name has been supplied on the path, use that otherwise use a default
    // https://jupyterlab.readthedocs.io/en/3.4.x/api/modules/services.session.html#isessionoptions
    const path = kernelOptions?.path ?? this.config.kernels.path;
    let name = 'thebe.ipynb';
    const match = path.match(/\/*([a-zA-Z0-9]+.ipynb)$/);
    if (match) {
      name = match[1];
    }

    const connection = await this.sessionManager?.startNew({
      name,
      path,
      type: 'notebook',
      kernel: {
        name: kernelOptions?.kernelName ?? this.config.kernels.kernelName,
      },
    });

    return new ThebeSession(this, connection, rendermime);
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

  async connectToExistingSession(model: SessionIModel, rendermime: IRenderMimeRegistry) {
    await this.ready;
    if (!this.sessionManager?.isReady) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }

    const connection = this.sessionManager?.connectTo({ model });

    return new ThebeSession(this, connection, rendermime);
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
      this.events.triggerStatus({
        status: ServerStatusEvent.launching,
        message: `Checking server url`,
      });
      await ThebeServer.status(serverSettings);
      this.events.triggerStatus({
        status: ServerStatusEvent.launching,
        message: `Server responds to pings`,
      });
      // eslint-disable-next-line no-empty
    } catch (err: any) {
      this.events.triggerError({
        status: ErrorStatusEvent.error,
        message: `Server not reachable (${serverSettings.baseUrl}) - ${err}`,
      });
      return;
    }

    const kernelManager = new KernelManager({ serverSettings });
    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Created KernelManager`,
    });

    this.sessionManager = new SessionManager({
      kernelManager,
      serverSettings,
    });

    this.events.triggerStatus({
      status: ServerStatusEvent.ready,
      message: `Created SessionManager`,
    });

    // Resolve the ready promise
    return this.sessionManager.ready.then(() => {
      this.events.triggerStatus({
        status: ServerStatusEvent.ready,
        message: `Server connection ready`,
      });
      this.resolveReadyFn?.(this);
    });
  }

  /**
   * Connect to Jupyterlite Server
   */
  async connectToJupyterLiteServer(config?: LiteServerConfig): Promise<void> {
    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Connecting to JupyterLite`,
    });

    if (!window.thebeLite)
      throw new Error(
        `thebe-lite is not available at window.thebeLite - load this onto your page before loading thebe or thebe-core.`,
      );

    const serviceManager = await window.thebeLite.startJupyterLiteServer(config);

    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Started JupyterLite server`,
    });

    console.debug(
      'thebe:api:connectToJupyterLiteServer:serverSettings:',
      serviceManager.serverSettings,
    );

    this.sessionManager = serviceManager.sessions;

    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Received SessionMananger from JupyterLite`,
    });

    return this.sessionManager?.ready.then(() => {
      this.events.triggerStatus({
        status: ServerStatusEvent.ready,
        message: `Server connection established`,
      });
      this.resolveReadyFn?.(this);
    });
  }

  async checkForSavedBinderSession() {
    const url = makeBinderUrl(this.config.binder);
    return getExistingServer(this.config.savedSessions, url);
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
    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Connecting to binderhub at ${this.config.binder.binderUrl}`,
    });

    const url = makeBinderUrl(this.config.binder);

    this.events.triggerStatus({
      status: ServerStatusEvent.launching,
      message: `Binder build url is ${url}`,
    });

    if (this.config.savedSessions.enabled) {
      console.debug('thebe:server:connectToServerViaBinder Checking for saved session...');
      // the follow function will ping the server based on the settings and only return
      // non-null if the server is still alive. So highly likely that the remainder of
      // the connection calls below, work.
      const existingSettings = await getExistingServer(this.config.savedSessions, url);
      if (existingSettings) {
        // Connect to the existing session
        const serverSettings = ServerConnection.makeSettings(existingSettings);
        const kernelManager = new KernelManager({ serverSettings });

        this.events.triggerStatus({
          status: ServerStatusEvent.launching,
          message: `Created KernelManager`,
        });

        this.sessionManager = new SessionManager({
          kernelManager,
          serverSettings,
        });

        this.events.triggerStatus({
          status: ServerStatusEvent.launching,
          message: `Created KernelManager`,
        });

        return this.sessionManager.ready.then(() => {
          this.events.triggerStatus({
            status: ServerStatusEvent.ready,
            message: `Re-connected to binder server`,
          });
          this.resolveReadyFn?.(this);
        });
        // else drop out of this block and request a new session
      }
    }

    const requestPromise: Promise<void> = new Promise((resolveRequest, rejectRequest) => {
      // Talk to the binder server
      const state: { status: StatusEvent } = {
        status: ServerStatusEvent.launching,
      };
      const es = new EventSource(url);
      this.events.triggerStatus({
        status: state.status,
        message: `Opened connection to binder: ${url}`,
      });

      // handle errors
      es.onerror = (evt: Event) => {
        console.error(`Lost connection to binder: ${url}`, evt);
        es?.close();
        state.status = ErrorStatusEvent.error;
        this.events.triggerError((evt as MessageEvent)?.data);
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
            state.status = ErrorStatusEvent.error;
            this.events.triggerError({
              status: ErrorStatusEvent.error,
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

              state.status = ServerStatusEvent.ready;
              this.events.triggerStatus({
                status: state.status,
                message: `Binder server is ready: ${msg.message}`,
              });

              resolveRequest();
            }
            break;
          default:
            this.events.triggerStatus({
              status: state.status,
              message: `Binder is: ${phase} - ${msg.message}`,
            });
        }
      };
    });

    return requestPromise.then(() => {
      this.resolveReadyFn?.(this);
    });
  }

  //
  // ServerRestAPI Implementation
  //
  getFetchUrl(relativeUrl: string) {
    // TODO use ServerConnection.makeRequest - this willadd the token
    // and use any internal fetch overrides
    // TODO BUG this is the wrong serverSetting, they should be for the active connection
    if (!this.sessionManager)
      throw new Error('Must connect to a server before requesting KernelSpecs');
    const settings = this.sessionManager?.serverSettings;
    const baseUrl = new URL(settings.baseUrl);
    const url = new URL(`${baseUrl.pathname}${relativeUrl}`.replace('//', '/'), baseUrl.origin);
    url.searchParams.append('token', settings.token);
    return url;
  }

  static status(serverSettings: Required<ServerSettings>): Promise<void | Response> {
    return ServerConnection.makeRequest(
      `${serverSettings.baseUrl}api/status`,
      {},
      ServerConnection.makeSettings(serverSettings),
    );
  }

  async getKernelSpecs() {
    if (!this.sessionManager)
      throw new Error('Must connect to a server before requesting KernelSpecs');
    return KernelSpecAPI.getSpecs(
      ServerConnection.makeSettings(this.sessionManager?.serverSettings),
    );
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
    console.debug('thebe:api:server:uploadFile', url);
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
