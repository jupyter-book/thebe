import type { ISessionConnection } from '@jupyterlab/services/lib/session/session';
import { ThebeManager } from './manager';
import type { MessageCallback } from './messaging';
import { MessageSubject, SessionStatus } from './messaging';
import type ThebeServer from './server';

class ThebeSession {
  server: ThebeServer;
  // see https://github.dev/jupyterlab/jupyterlab/blob/d48e0c04efb786561137fb20773fc15788507f0a/packages/logconsole/src/widget.ts line 43
  private _connection: ISessionConnection;
  private _messages?: MessageCallback;
  private _manager: ThebeManager;

  constructor(server: ThebeServer, connection: ISessionConnection, messages?: MessageCallback) {
    this.server = server;
    this._connection = connection;
    this._messages = messages;

    if (this._connection.kernel == null) throw Error('ThebeSession - kernel is null');
    this._manager = new ThebeManager(this._connection.kernel);

    this.messages({
      status: SessionStatus.ready,
      message: `New session started, kernel '${this._connection.kernel?.name}' available`,
    });
  }

  get id() {
    return this._connection.id;
  }

  get kernel() {
    return this._connection?.kernel;
  }

  get manager() {
    return this._manager;
  }

  get path() {
    return this._connection.path;
  }

  get name() {
    return this._connection.name;
  }

  messages({ status, message }: { status: SessionStatus; message: string }) {
    this._messages?.({
      id: this.id,
      subject: MessageSubject.session,
      status,
      message,
      object: this,
    });
  }

  async restart() {
    console.debug(`requesting restart for kernel ${this.id}`);
    const p = this._connection.kernel?.restart();

    this.messages({
      status: SessionStatus.starting,
      message: `Kernel restart requested`,
    });

    await p;

    this.messages({
      status: SessionStatus.ready,
      message: `New session started, kernel '${this._connection.kernel?.name}' available`,
    });
  }

  async shutdown() {
    await this._connection.shutdown();
    this.messages({
      status: SessionStatus.shutdown,
      message: `Session shutdown`,
    });
    return this._connection.dispose();
  }

  dispose() {
    this._connection.dispose();
  }
}

export default ThebeSession;
