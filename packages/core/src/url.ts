import type { BinderOptions, CustomRepoProviderSpec } from './types';
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
  if (opts.repoProvider !== 'git')
    throw Error(`Bad Provider, expected git got ${opts.repoProvider}`);
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
  if (opts.repoProvider !== 'gitlab')
    throw Error(`Bad Provider, expected gitlab got ${opts.repoProvider}`);
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
  if (opts.repoProvider !== 'github')
    throw Error(`Bad Provider, expected gitub got ${opts.repoProvider}`);
  if (!opts.repo) throw Error('repo is required for github provider');

  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gh/${repo}/${opts.ref ?? 'HEAD'}`;
}

function makeGistUrl(opts: BinderOptions): string {
  if (opts.repoProvider !== 'gist')
    throw Error(`Bad Provider, expected gist got ${opts.repoProvider}`);
  if (!opts.repo) throw Error('repo is required for gist provider');

  const repo = opts.repo.replace(/^(https?:\/\/)?github.com\//, '').replace(/(^\/)|(\/?$)/g, '');
  const binderUrl = opts.binderUrl?.replace(/(\/?$)/g, '');
  return `${binderUrl}/build/gist/${repo}/${opts.ref ?? 'HEAD'}`;
}

/**
 * Make a binder url for both well known or custom providers
 *
 * Custom providers are supported by passing in an array of CustomRepoProviderSpecs.
 *
 */
export function makeBinderUrl(
  opts: BinderOptions,
  customProviders?: CustomRepoProviderSpec[],
): string {
  let url: string;
  switch (opts.repoProvider) {
    case 'gitlab':
      url = makeGitLabUrl(opts);
      break;
    case 'github':
      url = makeGitHubUrl(opts);
      break;
    case 'gist':
      url = makeGistUrl(opts);
      break;
    case 'git':
      url = makeGitUrl(opts);
      break;
    default:
      const providerMap: Record<string, CustomRepoProviderSpec> =
        customProviders?.reduce((obj, spec) => ({ ...obj, [spec.name]: spec }), {}) ?? {};
      if (
        !customProviders ||
        customProviders.length === 0 ||
        !opts.repoProvider ||
        !Object.keys(providerMap).includes(opts.repoProvider)
      )
        throw Error(`Unknown provider ${opts.repoProvider}`);

      url = providerMap[opts.repoProvider].makeUrl(opts);
  }
  return url;
}
