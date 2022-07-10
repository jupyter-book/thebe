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
  _log?: MessageCallback;

  constructor(id: string, sessionManager: SessionManager, log?: MessageCallback) {
    this.id = id;
    this.sessionManager = sessionManager;
    this._ready = this.sessionManager.ready;
    this._log = log;
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

  async requestKernel(kernelOptions: Omit<KernelOptions, 'serverSettings'>) {
    if (!this.sessionManager) {
      throw Error('Requesting session from a server, with no SessionManager available');
    }
    this._log?.({
      id: this.id,
      subject: MessageSubject.session,
      status: SessionStatus.starting,
      message: 'requesting a new session',
    });
    const connection = await this.sessionManager?.startNew({
      name: kernelOptions.name,
      path: kernelOptions.path,
      type: 'notebook',
      kernel: {
        name: kernelOptions.kernelName ?? kernelOptions.name,
      },
    });

    // TODO register to handle the statusChanged signal
    // connection.statusChanged

    this._log?.({
      id: this.id,
      subject: MessageSubject.session,
      status: SessionStatus.ready,
      message: `New session started, kernel '${connection.kernel?.name}' available`,
    });

    return new ThebeSession(nanoid(), connection);
  }

  // TODO ThunkAction
  async fetchKernelNames() {
    if (!this.sessionManager) return { default: 'python', kernelSpecs: {} };
    return KernelSpecAPI.getSpecs(
      ServerConnection.makeSettings(this.sessionManager.serverSettings)
    );
  }

  async clear(options: Options) {
    const url = this.sessionManager?.serverSettings?.baseUrl;
    if (url)
      window.localStorage.removeItem(
        makeStorageKey(options.binderOptions.savedSession.storagePrefix, url)
      );
  }

  /**
   * Connect to a Jupyter server directly
   *
   */
  static async connectToJupyterServer(
    options: Options,
    log?: MessageCallback
  ): Promise<ThebeServer> {
    const id = nanoid();
    const serverSettings = ServerConnection.makeSettings(options.kernelOptions.serverSettings);
    console.debug('thebe:api:connectToJupyterServer:serverSettings:', serverSettings);

    let kernelManager = new KernelManager({ serverSettings });
    log?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created KernelManager: ${serverSettings.baseUrl}`,
    });

    const sessionManager = new SessionManager({ kernelManager, serverSettings });
    log?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Created SessionMananger: ${serverSettings.baseUrl}`,
    });

    const server = new ThebeServer(id, sessionManager, log);
    await server.ready;

    log?.({
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
  static async connectToJupyterLiteServer(log?: MessageCallback): Promise<ThebeServer> {
    const id = nanoid();
    const serviceManager = await startJupyterLiteServer(log);
    log?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Started JupyterLite server`,
    });

    console.debug(
      'thebe:api:connectToJupyterLiteServer:serverSettings:',
      serviceManager.serverSettings
    );

    const sessionManager = serviceManager.sessions;
    log?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Received SessionMananger from JupyterLite`,
    });

    const server = new ThebeServer(id, sessionManager, log);
    await server.ready;

    log?.({
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
    log?: MessageCallback
  ): Promise<ThebeServer> {
    const { binderOptions } = options;
    // request new server
    const id = nanoid();
    console.debug('thebe:server:connectToServerViaBinder binderUrl:', binderOptions.binderUrl);
    log?.({
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
    log?.({
      subject: MessageSubject.server,
      status: ServerStatus.launching,
      id,
      message: `Binder build url is ${url}`,
    });

    if (binderOptions.savedSession.enabled) {
      console.debug('thebe:server:connectToServerViaBinder Checking for saved session...');
      const existing = await getExistingServer(binderOptions, url);
      if (existing) {
        log?.({
          subject: MessageSubject.server,
          status: ServerStatus.launching,
          id,
          message: 'Found existing binder session, connecting...',
        });
        const { settings } = existing;
        if (settings) {
          const serverSettings = ServerConnection.makeSettings(settings);
          let kernelManager = new KernelManager({ serverSettings });
          const sessionManager = new SessionManager({ kernelManager, serverSettings });
          return new ThebeServer(existing.id, sessionManager, log);
        }
      }
    }

    return new Promise((resolve, reject) => {
      // Talk to the binder server
      const es = new EventSource(url);
      log?.({
        subject: MessageSubject.server,
        status: ServerStatus.launching,
        id,
        message: `Opened connection to binder: ${url}`,
      });

      // handle errors
      es.onerror = (evt: Event) => {
        console.error(`Lost connection to binder: ${url}`, evt);
        es?.close();
        log?.({
          subject: MessageSubject.server,
          status: ServerStatus.failed,
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
            log?.({
              subject: MessageSubject.server,
              status: ServerStatus.failed,
              id,
              message: `Binder: failed to build - ${url} - ${msg.message}`,
            });
            reject(msg);
            break;
          case 'ready': {
            es?.close();

            const settings: BasicServerSettings = {
              baseUrl: msg.url,
              wsUrl: 'ws' + msg.url.slice(4),
              token: msg.token,
              appendToken: true,
            };

            const serverSettings = ServerConnection.makeSettings(settings);
            let kernelManager = new KernelManager({ serverSettings });
            const sessionManager = new SessionManager({ kernelManager, serverSettings });

            if (binderOptions.savedSession.enabled) {
              saveServerInfo(binderOptions.savedSession, url, settings);
              console.debug(
                `thebe:server:connectToServerViaBinder Saved session for ${id} at ${url}`
              );
            }

            log?.({
              subject: MessageSubject.server,
              status: ServerStatus.ready,
              id,
              message: `Binder server is ready: ${msg.message}`,
            });
            resolve(new ThebeServer(id, sessionManager, log));
          }
          default:
            log?.({
              subject: MessageSubject.server,
              status: ServerStatus.launching,
              id,
              message: `Binder is: ${phase} - ${msg.message}`,
            });
        }
      };
    });
  }
}

export default ThebeServer;
