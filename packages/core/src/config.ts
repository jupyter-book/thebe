import {
  makeBinderOptions,
  makeKernelOptions,
  makeSavedSessionOptions,
  makeServerSettings,
} from './options';
import { ThebeEvents } from './events';
import type {
  BinderOptions,
  KernelOptions,
  CoreOptions,
  SavedSessionOptions,
  ServerSettings,
  MathjaxOptions,
  CustomRepoProviderSpec,
} from './types';

export class Config {
  private _options: Required<
    Omit<CoreOptions, 'binderOptions' | 'savedSessionOptions' | 'kernelOptions' | 'serverSettings'>
  >;
  private _binderOptions: Required<BinderOptions>;
  private _savedSessions: Required<SavedSessionOptions>;
  private _kernelOptions: Required<KernelOptions>;
  private _serverSettings: Required<Omit<ServerSettings, 'wsUrl'>> & { wsUrl?: string };
  private _events: ThebeEvents;
  private _repoProviders: CustomRepoProviderSpec[];

  constructor(
    opts: CoreOptions = {},
    extraConfig?: { events?: ThebeEvents; repoProviders?: CustomRepoProviderSpec[] },
  ) {
    this._events = extraConfig?.events ?? new ThebeEvents();
    this._repoProviders = extraConfig?.repoProviders ?? [];

    this._options = {
      mathjaxUrl:
        opts.mathjaxUrl ?? 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js',
      mathjaxConfig: opts.mathjaxConfig ?? 'TeX-AMS_CHTML-full,Safe',
    };

    this._binderOptions = makeBinderOptions(opts.binderOptions ?? {});
    this._savedSessions = makeSavedSessionOptions(opts.savedSessionOptions ?? {});
    this._kernelOptions = makeKernelOptions(opts.kernelOptions ?? {});
    this._serverSettings = makeServerSettings(opts.serverSettings ?? {});

    console.debug('thebe:config:constructor', this);
  }

  get events() {
    return this._events;
  }

  get base() {
    return this._options;
  }

  get mathjax(): MathjaxOptions {
    return {
      mathjaxUrl: this._options.mathjaxUrl,
      mathjaxConfig: this._options.mathjaxConfig,
    };
  }

  get binder() {
    return this._binderOptions;
  }

  get savedSessions() {
    return this._savedSessions;
  }

  get kernels() {
    return this._kernelOptions;
  }

  get serverSettings() {
    return this._serverSettings;
  }

  set serverSettings(newSettings: Required<Omit<ServerSettings, 'wsUrl'>> & { wsUrl?: string }) {
    this._serverSettings = newSettings;
  }
}
