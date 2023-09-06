import type { BinderOptions, BinderUrlSet, RepoProviderSpec } from './types';

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
function makeGitUrls(opts: BinderOptions) {
  if (!opts.repo) throw Error('repo is required for git provider');
  const { repo, binderUrl, ref } = opts;
  const encodedRepo = encodeURIComponent(repo.replace(/(^\/)|(\/?$)/g, ''));
  const base = binderUrl?.replace(/(\/?$)/g, '');
  const stub = `git/${encodedRepo}/${ref ?? 'HEAD'}`;
  return {
    build: `${base}/build/${stub}`,
    launch: `${base}/v2/${stub}`,
  };
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
function makeGitLabUrl(opts: BinderOptions) {
  if (!opts.repo) throw Error('repo is required for gitlab provider');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  const repo = encodeURIComponent(
    (opts.repo ?? '').replace(/^(https?:\/\/)?gitlab.com\//, '').replace(/(^\/)|(\/?$)/g, ''),
  );
  const stub = `gl/${repo}/${opts.ref ?? 'HEAD'}`;
  return {
    build: `${binderUrl}/build/${stub}`,
    launch: `${binderUrl}/v2/${stub}`,
  };
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
function makeGitHubUrl(opts: BinderOptions) {
  if (!opts.repo) throw Error('repo is required for github provider');
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  const stub = `gh/${repo}/${opts.ref ?? 'HEAD'}`;
  return {
    build: `${binderUrl}/build/${stub}`,
    launch: `${binderUrl}/v2/${stub}`,
  };
}

function makeGistUrl(opts: BinderOptions) {
  if (!opts.repo) throw Error('repo is required for gist provider');
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  const stub = `gist/${repo}/${opts.ref ?? 'HEAD'}`;
  return {
    build: `${binderUrl}/build/${stub}`,
    launch: `${binderUrl}/v2/${stub}`,
  };
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
export function makeBinderUrls(
  opts: BinderOptions,
  repoProviders: RepoProviderSpec[],
): BinderUrlSet {
  const providerMap: Record<string, RepoProviderSpec> =
    repoProviders.reduce((obj, spec) => ({ ...obj, [spec.name]: spec }), {}) ?? {};

  const provider = opts.repoProvider ?? 'github';
  if (!Object.keys(providerMap).includes(provider))
    throw Error(`Unknown provider ${opts.repoProvider}`);

  if (!providerMap[provider].makeUrls) throw Error(`No makeUrls function for ${provider}`);

  return providerMap[provider].makeUrls(opts);
}
