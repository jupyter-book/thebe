import type { Config } from './config';
import type { BinderUrlSet, RepoProviderSpec } from './types';

export function makeDefaultStorageKey(storagePrefix: string, url: string) {
  const urlObj = new URL(url);
  // ignore the query string and hash
  return `${storagePrefix}-${urlObj.origin + urlObj.pathname}`;
}

function makeDefaultBuildSpec(storagePrefix: string, binderUrl: string, stub: string) {
  const build = `${binderUrl}/build/${stub}`;
  const launch = `${binderUrl}/v2/${stub}`;

  return {
    build,
    launch,
    storageKey: makeDefaultStorageKey(storagePrefix, build),
  };
}

/**
 * Make a binder url for git providers
 *
 *  - trim trailing or leading '/' on repo
 *  - trailing / on binderUrl
 *  - convert to URL acceptable string. Required for git
 *
 * @param opts BinderOptions
 * @returns a binder compatible url
 */
function makeGitUrls(config: Config) {
  if (!config.binder.repo) throw Error('repo is required for git provider');
  const { repo, binderUrl, ref } = config.binder;
  const encodedRepo = encodeURIComponent(repo.replace(/(^\/)|(\/?$)/g, ''));
  const base = binderUrl?.replace(/(\/?$)/g, '');
  const stub = `git/${encodedRepo}/${ref ?? 'HEAD'}`;
  return makeDefaultBuildSpec(config.savedSessions.storagePrefix, base, stub);
}

/**
 * Make a binder url for gitlab providers
 *
 * - trim gitlab.com from repo
 * - trim trailing or leading '/' on repo
 * - convert to URL acceptable string. Required for gitlab
 * - trailing / on binderUrl
 *
 * @param opts BinderOptions
 * @returns  a binder compatible url
 */
function makeGitLabUrl(config: Config) {
  if (!config.binder.repo) throw Error('repo is required for gitlab provider');
  const binderUrl = config.binder.binderUrl?.replace(/(\/?$)/g, '');
  const repo = encodeURIComponent(
    (config.binder.repo ?? '')
      .replace(/^(https?:\/\/)?gitlab.com\//, '')
      .replace(/(^\/)|(\/?$)/g, ''),
  );
  const stub = `gl/${repo}/${config.binder.ref ?? 'HEAD'}`;
  return makeDefaultBuildSpec(config.savedSessions.storagePrefix, binderUrl, stub);
}

/**
 * Make a binder url for gitlab providers
 *
 * - trim github.com from repo
 * - trim trailing or leading '/' on repo
 * - convert to URL acceptable string. Required for gitlab
 * - trailing / on binderUrl
 *
 * @param opts BinderOptions
 * @returns  a binder compatible url
 */
function makeGitHubUrl(config: Config) {
  if (!config.binder.repo) throw Error('repo is required for github provider');
  const repo = config.binder.repo
    .replace(/^(https?:\/\/)?github.com\//, '')
    .replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = config.binder.binderUrl?.replace(/(\/?$)/g, '');
  const stub = `gh/${repo}/${config.binder.ref ?? 'HEAD'}`;

  return makeDefaultBuildSpec(config.savedSessions.storagePrefix, binderUrl, stub);
}

function makeGistUrl(config: Config) {
  if (!config.binder.repo) throw Error('repo is required for gist provider');
  const repo = config.binder.repo
    .replace(/^(https?:\/\/)?github.com\//, '')
    .replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = config.binder.binderUrl?.replace(/(\/?$)/g, '');
  const stub = `gist/${repo}/${config.binder.ref ?? 'HEAD'}`;

  return makeDefaultBuildSpec(config.savedSessions.storagePrefix, binderUrl, stub);
}

export const GITHUB_SPEC: RepoProviderSpec = {
  name: 'github',
  makeUrls: makeGitHubUrl,
};

export const GITLAB_SPEC: RepoProviderSpec = {
  name: 'gitlab',
  makeUrls: makeGitLabUrl,
};

export const GIT_SPEC: RepoProviderSpec = {
  name: 'git',
  makeUrls: makeGitUrls,
};

export const GIST_SPEC: RepoProviderSpec = {
  name: 'gist',
  makeUrls: makeGistUrl,
};

export const WELL_KNOWN_REPO_PROVIDERS = [GITHUB_SPEC, GITLAB_SPEC, GIT_SPEC, GIST_SPEC];

/**
 * Make a binder url for both well known or custom providers
 *
 * Custom providers are supported by passing in an array of CustomRepoProviderSpecs.
 *
 */
export function makeBinderUrls(config: Config, repoProviders: RepoProviderSpec[]): BinderUrlSet {
  const providerMap: Record<string, RepoProviderSpec> =
    repoProviders.reduce((obj, spec) => ({ ...obj, [spec.name]: spec }), {}) ?? {};

  const provider = config.binder.repoProvider ?? 'github';
  if (!Object.keys(providerMap).includes(provider))
    throw Error(`Unknown provider ${config.binder.repoProvider}`);

  if (!providerMap[provider].makeUrls) throw Error(`No makeUrls function for ${provider}`);

  return providerMap[provider].makeUrls(config);
}
