import { Config } from './config';
import type { ThebeEvents } from './events';
import type {
  ServerSettings,
  BinderOptions,
  KernelOptions,
  CoreOptions,
  SavedSessionOptions,
  MathjaxOptions,
} from './types';
import { RepoProvider } from './types';

export function makeBinderOptions(opts: BinderOptions) {
  return {
    repo: 'binder-examples/requirements',
    ref: 'master',
    binderUrl: 'https://mybinder.org',
    repoProvider: RepoProvider.github,
    ...opts,
  };
}

export function makeSavedSessionOptions(opts: SavedSessionOptions): Required<SavedSessionOptions> {
  return {
    enabled: true,
    maxAge: 86400,
    storagePrefix: 'thebe-binder-',
    ...opts,
  };
}

export function makeKernelOptions(opts: KernelOptions): Required<KernelOptions> {
  return {
    path: opts.path ?? '/',
    kernelName: opts.kernelName ?? 'python',
    name: opts.name ?? opts.kernelName ?? 'python',
  };
}

export function makeServerSettings(settings: ServerSettings): Required<ServerSettings> {
  return {
    baseUrl: 'http://localhost:8888',
    token: 'test-secret',
    appendToken: true,
    wsUrl: 'ws://localhost:8888',
    ...settings,
  };
}

export function makeMathjaxOptions(opts?: MathjaxOptions) {
  return {
    mathjaxUrl: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js',
    mathjaxConfig: 'TeX-AMS_CHTML-full,Safe',
    ...opts,
  };
}

export function makeConfiguration(
  options: CoreOptions & { [k: string]: any },
  events?: ThebeEvents,
) {
  return new Config(options, events);
}

export function ensureCoreOptions(
  options: CoreOptions & { [k: string]: any },
  events?: ThebeEvents,
): Required<CoreOptions> {
  const config = new Config(options, events);

  return {
    ...config.base,
    binderOptions: config.binder,
    savedSessionOptions: config.savedSessions,
    kernelOptions: config.kernels,
    serverSettings: config.serverSettings,
  };
}
