import { Session } from '@jupyterlab/services';
import { ISessionConnection } from '@jupyterlab/services/lib/session/session';

class ThebeSession {
  id: string;
  // see https://github.dev/jupyterlab/jupyterlab/blob/d48e0c04efb786561137fb20773fc15788507f0a/packages/logconsole/src/widget.ts line 43
  _connection?: ISessionConnection;

  constructor(id: string, connection: Session.ISessionConnection) {
    this.id = id;
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  get kernel() {
    return this._connection?.kernel;
  }

  async restart() {
    if (!this._connection) {
      console.error(`Trying to restart kernel with no connection`);
      return;
    }
    console.debug(`requesting restart for kernel ${this.id}`);
    await this._connection.kernel!.restart();
  }

  async refresh() {}
  async dispose() {}
}

export default ThebeSession;
