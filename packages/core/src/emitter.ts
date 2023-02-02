import type { Config } from './config';
import type { EventObject, EventSubject, StatusEvent, ErrorStatusEvent } from './events';
import { ThebeEventType } from './events';

export class EventEmitter {
  private _id: string;
  private _config: Config;
  private _subject: EventSubject;
  private _object: EventObject;

  constructor(id: string, config: Config, subject: EventSubject, object: EventObject) {
    this._id = id;
    this._config = config;
    this._subject = subject;
    this._object = object;
  }

  triggerStatus({ status, message }: { status: StatusEvent; message: string }) {
    console.debug(`${status} ${message}`);
    this._config.events.trigger(ThebeEventType.status, {
      subject: this._subject,
      id: this._id,
      object: this._object,
      status,
      message,
    });
  }

  triggerError({ status, message }: { status: ErrorStatusEvent; message: string }) {
    console.debug(`Error ${message}`);

    this._config.events.trigger(ThebeEventType.error, {
      subject: this._subject,
      id: this._id,
      object: this._object,
      status,
      message,
    });
  }
}
