import type { CoreOptions, JsonObject, KernelOptions, ServerSettings } from './types';
import { RepoProvider } from './types';
import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from './url';
import { getExistingServer, makeStorageKey, saveServerInfo } from './sessions';
import {
  KernelManager,
  KernelSpecAPI,
  ServerConnection,
  SessionManager,
} from '@jupyterlab/services';
import ThebeSession from './session';
import type { MessageCallback } from './messaging';
import { MessageSubject, ServerStatus, SessionStatus } from './messaging';
import { startJupyterLiteServer } from './jlite';
import type { Config } from './config';
import { makeConfiguration } from './options';
import { shortId } from './utils';

interface ServerRuntime {
  ready: Promise<void>;
  isReady: boolean;
  settings: ServerConnection.ISettings | undefined;
  shutdownAll: () => Promise<void>;
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
}

async function responseToJson(res: Response) {
  if (!res.ok) throw Error(`${res.status} - ${res.statusText}`);
  const json = await res.json();
  return json as RestAPIContentsResponse;
}

class ThebeServer implements ServerRuntime, ServerRestAPI {
  id: string;
  sessionManager: SessionManager | undefined;
  config: Config;
  private _ready: Promise<void>;
  private _messages?: MessageCallback;

  constructor(
    id: string,
    config: Config,
    sessionManager: SessionManager,
    messages?: MessageCallback,
  ) {
    this.id = id;
    this.sessionManager = sessionManager;
    this.config = config;
    this._ready = this.sessionManager.ready;
    this._messages = messages;
  }

  getFetchUrl(relative: string) {
    if (!this.isReady) throw Error('Calling ServerRestAPI without an active server connection');
    const settings = this.sessionManager!.serverSettings;
    const url = new URL(relative, settings.baseUrl);
    url.searchParams.append('token', settings.token);
    return url;
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

  get ready() {
    return this._ready;
  }

  get isReady(): boolean {
    return this.sessionManager?.isReady ?? false;
  }

  get settings() {
    return this.sessionManager?.serverSettings;
  }

  async shutdownAll() {
    await this.sessionManager?.shutdownAll();
  }

  async requestSession(kernelOptions: KernelOptions & { id?: string }) {
    if (!this.sessionManager) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }

    // TODO should be inside session!
    const id = kernelOptions.id ?? shortId();
    this._messages?.({
      id,
      subject: MessageSubject.session,
      status: SessionStatus.starting,
      message: 'requesting a new session',
    });
    const connection = await this.sessionManager?.startNew({
      name: kernelOptions.name ?? this.config.kernels.name,
      path: kernelOptions.path ?? this.config.kernels.path,
      type: 'notebook',
      kernel: {
        name: kernelOptions.kernelName ?? kernelOptions.name ?? this.config.kernels.kernelName,
      },
    });

    // TODO register to handle the statusChanged signal
    // connection.statusChanged
    const session = new ThebeSession(id, connection);

    this._messages?.({
      id,
      subject: MessageSubject.session,
      status: SessionStatus.ready,
      message: `New session started, kernel '${connection.kernel?.name}' available`,
      object: session,
    });

    return session;
  }

  // TODO ThunkAction
  async fetchKernelNames() {
    if (!this.sessionManager) return { default: 'python', kernelSpecs: {} };
    return KernelSpecAPI.getSpecs(
      ServerConnection.makeSettings(this.sessionManager.serverSettings),
    );
  }

  async clear() {
    const url = this.sessionManager?.serverSettings?.baseUrl;
    if (url)
      window.localStorage.removeItem(makeStorageKey(this.config.savedSessions.storagePrefix, url));
  }

  static async status(
    id: string,
    serverSettings: Required<ServerSettings>,
    throwOnError = true,
    messages?: MessageCallback,
  ) {
    try {
      return await ServerConnection.makeRequest(
        `${serverSettings.baseUrl}api/status`,
        {},
        ServerConnection.makeSettings(serverSettings),
      );
    } catch (err: any) {
      console.debug('thebe:api:connectToJupyterServer:', 'server unreachable');
      messages?.({
        subject: MessageSubject.server,
        status: ServerStatus.failed,
        id,
        message: `Failed to connect to server ${id}: ${err?.message}`,
      });
      if (throwOnError) throw Error(`Jupyter server unreachable ${err?.message}`);
    }
  }

  /**
   * Connect to a Jupyter server directly
   *
   */
  static async connectToJupyterServer(
    options: CoreOptions & { id?: string },
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const id = options.id ?? shortId();
    const config = makeConfiguration(options);

    console.debug('thebe:api:connectToJupyterServer:serverSettings:', config.serverSettings);

    const serverSettings = ServerConnection.makeSettings(config.serverSettings);

    const kernelManager = new KernelManager({ serverSettings });
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created KernelManager: ${config.serverSettings.baseUrl}`,
    });

    const sessionManager = new SessionManager({
      kernelManager,
      serverSettings,
    });

    const server = new ThebeServer(id, config, sessionManager, messages);

    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created SessionMananger: ${serverSettings.baseUrl}`,
      object: server,
    });

    await server.ready;

    try {
      // TODO? move this behind .ready? is it safe to do so far binder & jupyterlite?
      // or actually a better way of doing this is to setup the server to respond to the
      // connection failure signal
      // https://jupyterlab.readthedocs.io/en/stable/api/interfaces/services.session.imanager.html#connectionfailure
      await ThebeServer.status(id, serverSettings, true, messages);

      messages?.({
        subject: MessageSubject.server,
        status: ServerStatus.ready,
        id,
        message: `Server connection established`,
        object: server,
      });
      // eslint-disable-next-line no-empty
    } catch (err: any) {}

    return server;
  }

  /**
   * Connect to Jupyterlite Server
   *
   */
  static async connectToJupyterLiteServer(
    options: CoreOptions & { id?: string },
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const id = options?.id ?? shortId();
    const config = makeConfiguration(options);

    const serviceManager = await startJupyterLiteServer(messages);
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Started JupyterLite server`,
    });

    console.debug(
      'thebe:api:connectToJupyterLiteServer:serverSettings:',
      serviceManager.serverSettings,
    );

    const sessionManager = serviceManager.sessions;
    const server = new ThebeServer(id, config, sessionManager, messages);

    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Received SessionMananger from JupyterLite`,
      object: server,
    });

    await server.ready;

    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.ready,
      id,
      message: `Server connection established`,
      object: server,
    });

    return server;
  }

  /**
   * Connect to a Binder instance in order to
   * access a Jupyter server that can provide kernels
   *
   * @param ctx
   * @param opts
   * @returns
   */
  static async connectToServerViaBinder(
    options: CoreOptions & { id?: string },
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    // request new server
    const id = options.id ?? shortId();
    const config = makeConfiguration(options);

    console.debug('thebe:server:connectToServerViaBinder binderUrl:', config.binder.binderUrl);
    messages?.({
      subject: MessageSubject.server,
      id,
      status: ServerStatus.launching,
      message: `Connecting to binderhub at ${config.binder.binderUrl}`,
    });

    let url: string;
    switch (config.binder.repoProvider) {
      case RepoProvider.git:
        url = makeGitUrl(config.binder);
        break;
      case RepoProvider.gitlab:
        url = makeGitLabUrl(config.binder);
        break;
      case RepoProvider.github:
      default:
        url = makeGitHubUrl(config.binder);
        break;
    }
    console.debug('thebe:server:connectToServerViaBinder Binder build URL:', url);
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Binder build url is ${url}`,
    });

    if (config.savedSessions.enabled) {
      console.debug('thebe:server:connectToServerViaBinder Checking for saved session...');
      // the follow function will ping the server based on the settings and only return
      // non-null if the server is still alive. So highly likely that the remainder of
      // the connection calls below, work.
      const existingSettings = await getExistingServer(config.savedSessions, url);
      if (existingSettings) {
        messages?.({
          subject: MessageSubject.server,
          status: ServerStatus.launching,
          id,
          message: 'Found existing binder session, connecting...',
        });
        const serverSettings = ServerConnection.makeSettings(existingSettings);
        const kernelManager = new KernelManager({ serverSettings });
        const sessionManager = new SessionManager({
          kernelManager,
          serverSettings,
        });
        const server = new ThebeServer(
          options?.id ?? shortId(),
          makeConfiguration({ ...options, serverSettings }),
          sessionManager,
          messages,
        );

        await server.ready;

        messages?.({
          subject: MessageSubject.server,
          status: ServerStatus.ready,
          id,
          message: `Reconnected to existing binder server.`,
          object: server,
        });
        return server;
      }
    }

    return new Promise((resolve, reject) => {
      // Talk to the binder server
      const state = { status: ServerStatus.launching };
      const es = new EventSource(url);
      messages?.({
        subject: MessageSubject.server,
        status: state.status,
        id,
        message: `Opened connection to binder: ${url}`,
      });

      // handle errors
      es.onerror = (evt: Event) => {
        console.error(`Lost connection to binder: ${url}`, evt);
        es?.close();
        state.status = ServerStatus.failed;
        messages?.({
          subject: MessageSubject.server,
          status: state.status,
          id,
          message: (evt as MessageEvent)?.data,
        });
        reject(evt);
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
            messages?.({
              subject: MessageSubject.server,
              status: state.status,
              id,
              message: `Binder: failed to build - ${url} - ${msg.message}`,
            });
            reject(msg);
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
              const sessionManager = new SessionManager({
                kernelManager,
                serverSettings,
              });

              if (config.savedSessions.enabled) {
                saveServerInfo(config.savedSessions, url, id, serverSettings);
                console.debug(
                  `thebe:server:connectToServerViaBinder Saved session for ${id} at ${url}`,
                );
              }

              const server = new ThebeServer(id, config, sessionManager, messages);

              await server.ready;

              state.status = ServerStatus.ready;
              messages?.({
                subject: MessageSubject.server,
                status: state.status,
                id,
                message: `Binder server is ready: ${msg.message}`,
                object: server,
              });

              resolve(server);
            }
            break;
          default:
            messages?.({
              subject: MessageSubject.server,
              id,
              status: state.status,
              message: `Binder is: ${phase} - ${msg.message}`,
            });
        }
      };
    });
  }
}

export default ThebeServer;
