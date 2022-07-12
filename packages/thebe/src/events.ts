export type ThebeEventCb = (event: string, data: any) => void;

// TODO pull together events that thebe uses

export class ThebeEvents {
  listeners: Record<string, Map<(evt: any) => {}, { unbind: boolean }>>;

  constructor() {
    this.listeners = {};
  }

  trigger(event: string, evt: any) {
    if (!(event in this.listeners)) return;
    this.listeners[event].forEach(({ unbind }, cb) => {
      cb(evt);
      if (unbind) this.listeners[event].delete(cb);
    });
  }

  on(event: string, cb: (evt: any) => {}) {
    this.listeners[event].set(cb, { unbind: false });
    return () => this.off(event, cb);
  }

  one(event: string, cb: (evt: any) => {}) {
    this.listeners[event].set(cb, { unbind: true });
    return () => this.off(event, cb);
  }

  off(event: string, cb: (evt: any) => {}) {
    if (!(event in this.listeners)) return;
    this.listeners[event].delete(cb);
  }
}

const events = new ThebeEvents();

export const trigger = function (event: string, evt: any) {
  events.trigger.apply(events, [event, evt]);
};
export const on = function (event: string, evt: any) {
  events.on.apply(events, [event, evt]);
};
export const one = function (event: string, evt: any) {
  events.one.apply(events, [event, evt]);
};
export const off = function (event: string, evt: any) {
  events.off.apply(events, [event, evt]);
};
