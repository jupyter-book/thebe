import { Config } from './config';
import {
  ServerSettings,
  BinderOptions,
  KernelOptions,
  CoreOptions,
  RepoProvider,
  SavedSessionOptions,
} from './types';

export function makeBinderOptions(opts: BinderOptions) {
  return {
    repo: 'binder-examples/requirements',
    ref: 'master',
    binderUrl: 'https://mybinder.org',
    repoProvider: RepoProvider.github,
    ...opts,
  };
}

export function makeSavedSessionOptions(opts: SavedSessionOptions) {
  return {
    enabled: true,
    maxAge: 86400,
    storagePrefix: 'thebe-binder-',
    ...opts,
  };
}

export function makeKernelOptions(opts: KernelOptions) {
  return {
    path: '/',
    name: 'python',
    kernelName: 'python',
    ...opts,
  };
}

export function makeServerSettings(settings: ServerSettings) {
  return {
    baseUrl: 'http://localhost:8888',
    token: 'test-secret',
    appendToken: true,
    ...settings,
  };
}

export function makeConfiguration(options: CoreOptions & { [k: string]: any }) {
  return new Config(options);
}

export function ensureCoreOptions(
  options: CoreOptions & { [k: string]: any },
): Required<CoreOptions> {
  const config = new Config(options);

  return {
    ...config.base,
    binderOptions: config.binder,
    savedSessionOptions: config.savedSessions,
    kernelOptions: config.kernels,
    serverSettings: config.serverSettings,
  };
}
