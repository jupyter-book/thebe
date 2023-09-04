import type { BinderOptions, RepoProviderSpec } from './types';
import { WellKnownRepoProvider } from './types';

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
function makeGitUrl(opts: BinderOptions): string {
  if (!opts.repo) throw Error('repo is required for git provider');
  const { repo, binderUrl, ref } = opts;
  const encodedRepo = encodeURIComponent(repo.replace(/(^\/)|(\/?$)/g, ''));
  return `${binderUrl?.replace(/(\/?$)/g, '')}/build/git/${encodedRepo}/${ref ?? 'HEAD'}`;
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
function makeGitLabUrl(opts: BinderOptions): string {
  if (!opts.repo) throw Error('repo is required for gitlab provider');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  const repo = encodeURIComponent(
    (opts.repo ?? '').replace(/^(https?:\/\/)?gitlab.com\//, '').replace(/(^\/)|(\/?$)/g, ''),
  );
  return `${binderUrl}/build/gl/${repo}/${opts.ref ?? 'HEAD'}`;
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
function makeGitHubUrl(opts: BinderOptions): string {
  if (!opts.repo) throw Error('repo is required for github provider');
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gh/${repo}/${opts.ref ?? 'HEAD'}`;
}

function makeGistUrl(opts: BinderOptions): string {
  if (!opts.repo) throw Error('repo is required for gist provider');
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gist/${repo}/${opts.ref ?? 'HEAD'}`;
}

export const GITHUB_SPEC: RepoProviderSpec = {
  name: 'github',
  makeUrl: makeGitHubUrl,
};

export const GITLAB_SPEC: RepoProviderSpec = {
  name: 'gitlab',
  makeUrl: makeGitLabUrl,
};

export const GIT_SPEC: RepoProviderSpec = {
  name: 'git',
  makeUrl: makeGitUrl,
};

export const GIST_SPEC: RepoProviderSpec = {
  name: 'gist',
  makeUrl: makeGistUrl,
};

export const WELL_KNOWN_REPO_PROVIDERS = [GITHUB_SPEC, GITLAB_SPEC, GIT_SPEC, GIST_SPEC];

/**
 * Make a binder url for both well known or custom providers
 *
 * Custom providers are supported by passing in an array of CustomRepoProviderSpecs.
 *
 */
export function makeBinderUrl(opts: BinderOptions, repoProviders: RepoProviderSpec[]): string {
  const providerMap: Record<string, RepoProviderSpec> =
    repoProviders.reduce((obj, spec) => ({ ...obj, [spec.name]: spec }), {}) ?? {};

  const provider = opts.repoProvider ?? 'github';
  if (!Object.keys(providerMap).includes(provider))
    throw Error(`Unknown provider ${opts.repoProvider}`);

  return providerMap[provider].makeUrl(opts);
}
