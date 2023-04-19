import type { ISessionConnection } from '@jupyterlab/services/lib/session/session';
import { EventSubject, SessionStatusEvent } from './events';
import { ThebeManager } from './manager';
import type ThebeServer from './server';
import { EventEmitter } from './emitter';

class ThebeSession {
  readonly server: ThebeServer;
  readonly manager: ThebeManager;
  // see https://github.dev/jupyterlab/jupyterlab/blob/d48e0c04efb786561137fb20773fc15788507f0a/packages/logconsole/src/widget.ts line 43
  private connection: ISessionConnection;
  private events: EventEmitter;

  constructor(server: ThebeServer, connection: ISessionConnection) {
    this.server = server;
    this.connection = connection;
    this.events = new EventEmitter(this.connection.id, server.config, EventSubject.session, this);

    if (this.connection.kernel == null) throw Error('ThebeSession - kernel is null');
    this.manager = new ThebeManager(this.connection.kernel);

    this.events.triggerStatus({
      status: SessionStatusEvent.ready,
      message: `New session started, kernel '${this.connection.kernel?.name}' available`,
    });
  }

  get id() {
    return this.connection.id;
  }

  get kernel() {
    return this.connection?.kernel;
  }

  get path() {
    return this.connection.path;
  }

  get name() {
    return this.connection.name;
  }

  async restart() {
    console.debug(`requesting restart for kernel ${this.id}`);
    const p = this.connection.kernel?.restart();

    this.events.triggerStatus({
      status: SessionStatusEvent.starting,
      message: `Kernel restart requested`,
    });

    await p;

    this.events.triggerStatus({
      status: SessionStatusEvent.ready,
      message: `New session started, kernel '${this.connection.kernel?.name}' available`,
    });
  }

  async shutdown() {
    if (this.connection.isDisposed) return;
    await this.connection.shutdown();
    this.events.triggerStatus({
      status: SessionStatusEvent.shutdown,
      message: `session ${this.name}`,
    });
    this.dispose();
  }

  dispose() {
    if (!this.connection.isDisposed) this.connection.dispose();
  }
}

export default ThebeSession;
