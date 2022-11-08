import { ThebeEvents } from 'thebe-core';
import * as thebe from './thebe';

export * from './types';
export * from './thebe';

export function setupGlobals() {
  if (!window.thebe) {
    const events = new ThebeEvents();

    window.thebe = {
      ...thebe,
      events,
      trigger: events.trigger.bind(events),
      on: events.on.bind(events),
      one: events.one.bind(events),
      off: events.off.bind(events),
    } as any;

    window.thebelab = window.thebe;
  }
}

if ((window as any) !== undefined) {
  setupGlobals();

  document.addEventListener('DOMContentLoaded', () => {
    const options = thebe.getPageConfig();
    if (options.mountStatusWidget) {
      thebe.mountStatusWidget();
    }
    if (options.mountActivateWidget) {
      thebe.mountActivateWidget(options);
    }
    if (options['bootstrap']) {
      thebe.bootstrap(options);
    }
  });
}
