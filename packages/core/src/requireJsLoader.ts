/**
 * Inspired by https://github.com/jupyterlab/jupyterlab-plugin-playground/blob/main/src/requirejs.ts
 */

const REQUIREJS_CDN_URL = 'https://cdn.jsdelivr.net/npm/';
const REQUIREJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js';

export interface IRequireJS {
  readonly require: Require;
  readonly define: RequireDefine;
}

async function fetchAndLoadInFrame(baseUrl: string): Promise<IRequireJS> {
  if (typeof document === 'undefined')
    throw new Error('Cannot load requirejs outside of the browser');

  const res = await fetch(REQUIREJS_URL);
  if (!res.ok) {
    throw new Error(`Could not fetch requirejs ${res.status} ${res.statusText}`);
  }

  const requireJsSource = await res.text();

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.onload = () => {
      const contentWindow = iframe.contentWindow;
      if (!contentWindow) return reject('Cannot load in isolated: no contentWindow, origin error?');

      contentWindow.window.eval(requireJsSource);
      const requirejs: IRequireJS = {
        require: (contentWindow.window as any).require,
        define: (contentWindow.window as any).define,
      };
      if (!requirejs.require || !requirejs.define)
        return reject(
          'Require.js loading did not result in `require` and `define` objects attachment to window',
        );

      requirejs.require.config({ baseUrl });

      resolve(requirejs);
      iframe.onload = null;
    };
    document.body.appendChild(iframe);
  });
}

export class RequireJsLoader {
  requested: boolean;
  readonly baseUrl: string;
  readonly ready: Promise<IRequireJS>;
  requirejs?: IRequireJS;
  private resolveFn: (value: IRequireJS | PromiseLike<IRequireJS>) => void;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? REQUIREJS_CDN_URL;
    this.requested = false;
    this.resolveFn = () => ({});
    this.ready = new Promise<IRequireJS>((resolve) => (this.resolveFn = resolve));
  }

  async load(postLoadFn?: (require: Require, define: RequireDefine) => Promise<void> | void) {
    if (!this.requested) {
      this.requested = true;
      this.requirejs = await fetchAndLoadInFrame(this.baseUrl);
      await postLoadFn?.(this.requirejs.require, this.requirejs.define);
      this.resolveFn(this.requirejs);
    }
    return this.ready;
  }
}
