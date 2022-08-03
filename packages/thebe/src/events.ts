import { MessageCallbackArgs } from 'thebe-core';

export type ThebeEventCb = (event: string, data: MessageCallbackArgs) => void;

export class ThebeEvents {
  listeners: Record<string, Map<ThebeEventCb, { unbind: boolean }>>;

  constructor() {
    this.listeners = {};
  }

  _ensureMap(event: string) {
    if (!(event in this.listeners)) this.listeners[event] = new Map();
  }

  trigger(event: string, evt: MessageCallbackArgs) {
    if (!(event in this.listeners)) return;
    this.listeners[event].forEach(({ unbind }, cb) => {
      cb(event, evt);
      if (unbind) this.listeners[event].delete(cb);
    });
  }

  on(event: string, cb: ThebeEventCb) {
    this._ensureMap(event);
    this.listeners[event].set(cb, { unbind: false });
    return () => this.off(event, cb);
  }

  one(event: string, cb: ThebeEventCb) {
    this._ensureMap(event);
    this.listeners[event].set(cb, { unbind: true });
    return () => this.off(event, cb);
  }

  off(event: string, cb: ThebeEventCb) {
    if (!(event in this.listeners)) return;
    this.listeners[event].delete(cb);
  }
}

export const events = new ThebeEvents();

export const trigger = function (event: string, evt: MessageCallbackArgs) {
  events.trigger.apply(events, [event, evt]);
};
export const on = function (event: string, cb: ThebeEventCb) {
  events.on.apply(events, [event, cb]);
};
export const one = function (event: string, cb: ThebeEventCb) {
  events.one.apply(events, [event, cb]);
};
export const off = function (event: string, cb: ThebeEventCb) {
  events.off.apply(events, [event, cb]);
};
