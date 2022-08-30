import type { CoreOptions, KernelOptions, ServerSettings } from './types';
import { RepoProvider } from './types';
import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from './url';
import { nanoid } from 'nanoid';
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

class ThebeServer {
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

  get ready() {
    return this._ready;
  }

  isReady(): boolean {
    return this.sessionManager?.isReady ?? false;
  }

  get settings() {
    return this.sessionManager?.serverSettings;
  }

  async requestSession(kernelOptions: KernelOptions & { id?: string }) {
    if (!this.sessionManager) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }
    const id = kernelOptions.id ?? nanoid();
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

    this._messages?.({
      id,
      subject: MessageSubject.session,
      status: SessionStatus.ready,
      message: `New session started, kernel '${connection.kernel?.name}' available`,
    });

    return new ThebeSession(id, connection);
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

  /**
   * Connect to a Jupyter server directly
   *
   */
  static async connectToJupyterServer(
    options: CoreOptions & { id?: string },
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const id = options.id ?? nanoid();
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
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created SessionMananger: ${serverSettings.baseUrl}`,
    });

    const server = new ThebeServer(id, config, sessionManager, messages);

    try {
      await server.ready;

      messages?.({
        subject: MessageSubject.server,
        status: ServerStatus.ready,
        id,
        message: `Server connection established`,
      });
    } catch (err: any) {
      messages?.({
        subject: MessageSubject.server,
        status: ServerStatus.failed,
        id,
        message: `Failed to connect to server ${server.id}: ${err.message}`,
      });
    }

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
    const id = options?.id ?? nanoid();
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
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Received SessionMananger from JupyterLite`,
    });

    const server = new ThebeServer(id, config, sessionManager, messages);
    await server.ready;

    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.ready,
      id,
      message: `Server connection established`,
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
    const id = options.id ?? nanoid();
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
      const existing = await getExistingServer(config.savedSessions, url);
      if (existing) {
        messages?.({
          subject: MessageSubject.server,
          status: ServerStatus.launching,
          id,
          message: 'Found existing binder session, connecting...',
        });
        const { settings } = existing;
        if (settings) {
          const serverSettings = ServerConnection.makeSettings(settings);
          const kernelManager = new KernelManager({ serverSettings });
          const sessionManager = new SessionManager({
            kernelManager,
            serverSettings,
          });
          return new ThebeServer(
            existing.id,
            makeConfiguration({ ...options, serverSettings }),
            sessionManager,
            messages,
          );
        }
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
                saveServerInfo(config.savedSessions, url, serverSettings);
                console.debug(
                  `thebe:server:connectToServerViaBinder Saved session for ${id} at ${url}`,
                );
              }

              state.status = ServerStatus.ready;
              messages?.({
                subject: MessageSubject.server,
                status: state.status,
                id,
                message: `Binder server is ready: ${msg.message}`,
              });
              resolve(new ThebeServer(id, config, sessionManager, messages));
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
