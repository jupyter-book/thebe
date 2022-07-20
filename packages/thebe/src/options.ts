import type { BinderOptions, Options as CoreOptions } from 'thebe-core';
import { ensureOptions as ensureCoreOptions } from 'thebe-core';
import merge from 'lodash.merge';

// Exposing @jupyter-widgets/base and @jupyter-widgets/controls as amd
// modules for custom widget bundles that depend on it.

export interface Options extends CoreOptions {
  selector: string;
  outputSelector: string;
  bootstrap: boolean;
  preRenderHook?: () => void;
  requestKernel: boolean;
  predefinedOutput: boolean;
  mountStatusWidget: boolean;
  mountActivateWidget: boolean;
  mountRunButton: boolean;
  mountRunAllButton: boolean;
  mountRestartButton: boolean;
  mountRestartallButton: boolean;
  stripPrompts?: {
    inPrompt?: string;
    continuationPrompt?: string;
  };
  stripOutputPrompts?: { outPrompt?: string };
  codeMirrorConfig?: {
    theme?: string;
    readOnly?: boolean;
  };
}

// options
const _defaultOptions: Options = {
  ...ensureCoreOptions({ requestKernel: false }),
  bootstrap: false,
  preRenderHook: undefined,
  stripPrompts: undefined,
  stripOutputPrompts: undefined,
  predefinedOutput: true,
  mountStatusWidget: true,
  mountActivateWidget: true,
  selector: '[data-executable]',
  outputSelector: '[data-output]',
  mountRunButton: true,
  mountRunAllButton: true,
  mountRestartButton: true,
  mountRestartallButton: true,
};

let _pageConfigData: Options | undefined;

const getKeyValue =
  <U extends keyof T, T extends object>(key: U) =>
  (obj: T) =>
    obj[key];

export function mergeOptions(options: Partial<Options>): Options {
  const optionsOnPage = getPageConfig();
  return merge(optionsOnPage, options);
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
    _pageConfigData = _defaultOptions;
    const elList = document.querySelectorAll("script[type='text/x-thebe-config']");
    elList.forEach((el) => {
      if (el.getAttribute('data-thebe-loaded')) return;
      el.setAttribute('data-thebe-loaded', 'true');
      let pageConfigFragment = undefined;
      try {
        pageConfigFragment = eval(`(${el.textContent})`);
        if (pageConfigFragment) {
          console.log('loading thebe config', pageConfigFragment);
          _pageConfigData = merge(_pageConfigData, pageConfigFragment);
        } else {
          console.log('No thebeConfig found in ', el);
        }
      } catch (e) {
        console.error('Error loading thebe config', e, el.textContent);
      }
    });
  }
  return _pageConfigData;
}