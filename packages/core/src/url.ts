import { BinderRequestOptions, RepoProvider } from './types';

function throwOnBadProvider(actual: RepoProvider, expected: RepoProvider) {
  if (actual !== expected) throw Error(`Bad Provider, expected ${expected} got ${actual}`);
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
export function makeGitUrl(opts: BinderRequestOptions): string {
  throwOnBadProvider(opts.repoProvider, RepoProvider.git);
  const { repo, binderUrl, ref } = opts;
  const encodedRepo = encodeURIComponent(repo.replace(/(^\/)|(\/?$)/g, ''));
  return `${binderUrl.replace(/(\/?$)/g, '')}/build/git/${encodedRepo}/${ref}`;
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
export function makeGitLabUrl(opts: BinderRequestOptions): string {
  throwOnBadProvider(opts.repoProvider, RepoProvider.gitlab);
  let binderUrl = opts.binderUrl.replace(/(\/?$)/g, '');
  const repo = encodeURIComponent(
    opts.repo.replace(/^(https?:\/\/)?gitlab.com\//, '').replace(/(^\/)|(\/?$)/g, ''),
  );
  return `${binderUrl}/build/gl/${repo}/${opts.ref}`;
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
export function makeGitHubUrl(opts: BinderRequestOptions): string {
  throwOnBadProvider(opts.repoProvider, RepoProvider.github);
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  let binderUrl = opts.binderUrl.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gh/${repo}/${opts.ref}`;
}

export function makeGistUrl(opts: BinderRequestOptions): string {
  throwOnBadProvider(opts.repoProvider, RepoProvider.gist);
  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  let binderUrl = opts.binderUrl.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gist/${repo}/${opts.ref}`;
}
