import * as thebe from './thebe';

export * from './types';
export * from './thebe';
export * from './utils';

if (typeof window !== 'undefined') {
  window.thebe = { ...thebe };

  document.addEventListener('DOMContentLoaded', () => {
    const options = thebe.getPageConfig();
    if (options.mountStatusWidget) {
      thebe.mountStatusWidget();
    }
    if (options.mountActivateWidget) {
      thebe.mountActivateWidget();
    }
    if (options['bootstrap']) {
      thebe.bootstrap(options);
    }
  });
}
