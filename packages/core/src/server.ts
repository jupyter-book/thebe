import { RepoProvider, BasicServerSettings, Options, KernelOptions } from './types';
import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from './url';
import { nanoid } from 'nanoid';
import { getExistingServer, makeStorageKey, removeServerInfo, saveServerInfo } from './sessions';
import {
  KernelManager,
  KernelSpecAPI,
  ServerConnection,
  SessionManager,
} from '@jupyterlab/services';
import ThebeSession from './session';
import { MessageCallback, MessageSubject, ServerStatus, SessionStatus } from './messaging';
import { startJupyterLiteServer } from './jlite';

class ThebeServer {
  id: string;
  sessionManager: SessionManager | undefined;
  _ready: Promise<void>;
  _messages?: MessageCallback;

  constructor(id: string, sessionManager: SessionManager, messages?: MessageCallback) {
    this.id = id;
    this.sessionManager = sessionManager;
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

  async requestSession(options: { name: string; path: string; kernelName?: string; id?: string }) {
    if (!this.sessionManager) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }
    const id = options.id ?? nanoid();
    this._messages?.({
      id,
      subject: MessageSubject.session,
      status: SessionStatus.starting,
      message: 'requesting a new session',
    });
    const connection = await this.sessionManager?.startNew({
      name: options.name,
      path: options.path,
      type: 'notebook',
      kernel: {
        name: options.kernelName ?? options.name,
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

  async clear(options: Options) {
    const url = this.sessionManager?.serverSettings?.baseUrl;
    if (url)
      window.localStorage.removeItem(
        makeStorageKey(options.binderOptions.savedSession.storagePrefix, url),
      );
  }

  /**
   * Connect to a Jupyter server directly
   *
   */
  static async connectToJupyterServer(
    options: Options,
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const id = options.id ?? nanoid();
    const serverSettings = ServerConnection.makeSettings(options.kernelOptions.serverSettings);
    console.debug('thebe:api:connectToJupyterServer:serverSettings:', serverSettings);

    const kernelManager = new KernelManager({ serverSettings });
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created KernelManager: ${serverSettings.baseUrl}`,
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

    const server = new ThebeServer(id, sessionManager, messages);
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
   * Connect to Jupyterlite Server
   *
   */
  static async connectToJupyterLiteServer(
    options?: { id?: string },
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const id = options?.id ?? nanoid();
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

    const server = new ThebeServer(id, sessionManager, messages);
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
    options: Options,
    messages?: MessageCallback,
  ): Promise<ThebeServer> {
    const { binderOptions } = options;
    // request new server
    const id = options.id ?? nanoid();
    console.debug('thebe:server:connectToServerViaBinder binderUrl:', binderOptions.binderUrl);
    messages?.({
      subject: MessageSubject.server,
      id,
      status: ServerStatus.launching,
      message: `Connecting to binderhub at ${binderOptions.binderUrl}`,
    });

    let url: string;
    switch (binderOptions.repoProvider) {
      case RepoProvider.git:
        url = makeGitUrl(binderOptions);
        break;
      case RepoProvider.gitlab:
        url = makeGitLabUrl(binderOptions);
        break;
      case RepoProvider.github:
      default:
        url = makeGitHubUrl(binderOptions);
        break;
    }
    console.debug('thebe:server:connectToServerViaBinder Binder build URL:', url);
    messages?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Binder build url is ${url}`,
    });

    if (binderOptions.savedSession.enabled) {
      console.debug('thebe:server:connectToServerViaBinder Checking for saved session...');
      const existing = await getExistingServer(binderOptions, url);
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
          return new ThebeServer(existing.id, sessionManager, messages);
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

              const settings: BasicServerSettings = {
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

              if (binderOptions.savedSession.enabled) {
                saveServerInfo(binderOptions.savedSession, url, settings);
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
              resolve(new ThebeServer(id, sessionManager, messages));
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
