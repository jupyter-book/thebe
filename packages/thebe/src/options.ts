import type { CoreOptions } from 'thebe-core';
import { ensureCoreOptions } from 'thebe-core';
import merge from 'lodash.merge';
import JSON5 from 'json5';

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

export interface ThebeOptions {
  bootstrap?: boolean;
  useBinder?: boolean;
  useJupyterLite?: boolean;
  requestKernel?: boolean;
  // UI related options
  selector?: string;
  outputSelector?: string;
  predefinedOutput?: boolean;
  mountStatusWidget?: boolean;
  mountActivateWidget?: boolean;
  mountRunButton?: boolean;
  mountRunAllButton?: boolean;
  mountRestartButton?: boolean;
  mountRestartallButton?: boolean;
  preRenderHook?: (() => void) | null;
  // thebe specific options
  stripPrompts?: {
    inPrompt?: string;
    continuationPrompt?: string;
  };
  stripOutputPrompts?: { outPrompt?: string };
  codeMirrorConfig?: {
    theme?: string;
    readOnly?: boolean;
    mode?: string;
    autoRefresh?: boolean;
    lineNumbers?: boolean;
    styleActiveLine?: boolean;
    matchBrackets?: boolean;
  };
}

export type Options = ThebeOptions & CoreOptions;

export const defaultSelector = '[data-executable]';
export const defaultOutputSelector = '[data-output]';

// options
export const defaultOptions: ThebeOptions = {
  bootstrap: false,
  useBinder: true,
  useJupyterLite: false,
  requestKernel: true,
  preRenderHook: null,
  predefinedOutput: true,
  mountStatusWidget: true,
  mountActivateWidget: true,
  selector: defaultSelector,
  outputSelector: defaultOutputSelector,
  mountRunButton: true,
  mountRunAllButton: true,
  mountRestartButton: true,
  mountRestartallButton: true,
  codeMirrorConfig: {},
};

let _pageConfigData: Options | undefined;

const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

export function mergeOptions(options: Partial<Options>): Options {
  const optionsOnPage = getPageConfig();
  const merged = merge({}, optionsOnPage, options);
  if (!merged.codeMirrorConfig && (merged.binderOptions as any).codeMirrorConfig) {
    merged.codeMirrorConfig = (merged.binderOptions as any).codeMirrorConfig;
  }
  return { ...merged, ...ensureCoreOptions(merged) };
}

export function resetPageConfig() {
  _pageConfigData = undefined;
}

export function getPageConfig(): Options {
  ensurePageConfigLoaded();
  return _pageConfigData as Options;
}

export function getPageConfigValue(key: keyof Options) {
  const config = getPageConfig();
  if (!config) return getKeyValue<keyof Options, Options>(key)(config);
}

export function ensurePageConfigLoaded() {
  if (!_pageConfigData) {
    let fragments = {};
    const elList = document.querySelectorAll("script[type='text/x-thebe-config']");
    elList.forEach((el) => {
      if (el.getAttribute('data-thebe-loaded')) return;
      el.setAttribute('data-thebe-loaded', 'true');
      if (!el.textContent) return;
      let pageConfigFragment = undefined;
      try {
        pageConfigFragment = JSON5.parse(el.textContent);
        if (pageConfigFragment) {
          console.debug('loading thebe config', pageConfigFragment);
          fragments = merge(fragments, pageConfigFragment);
        } else {
          console.debug('No thebeConfig found in ', el);
        }
      } catch (e) {
        console.error('Error loading thebe config', e, el.textContent);
      }
    });

    _pageConfigData = { ...defaultOptions, ...fragments };
  }
  return _pageConfigData;
}
