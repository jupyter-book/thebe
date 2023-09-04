import { describe, test, expect } from 'vitest';
import { WELL_KNOWN_REPO_PROVIDERS, makeBinderUrl } from '../src/url';
import { makeBinderOptions } from '../src/options';
import { BinderOptions } from '../src/types';

const binderUrl = 'https://binder.curvenote.dev/';

describe('building binder urls', () => {
  describe('well known providers', () => {
    test('git', () => {
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'git' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/HEAD');
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'git', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/main');
    });
    test('gitlab', () => {
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'gitlab' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/HEAD');
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'gitlab', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/main');
    });
    test('github', () => {
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'github' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/HEAD');
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'github', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/main');
    });
    test('gist', () => {
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'gist' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gist/executablebooks/thebe-binder-base/HEAD');
      expect(
        makeBinderUrl(
          makeBinderOptions({ binderUrl, repoProvider: 'gist', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual('https://binder.curvenote.dev/build/gist/executablebooks/thebe-binder-base/main');
    });
  });
  test('unknown provider throws', () => {
    expect(() =>
      makeBinderUrl(
        makeBinderOptions({ binderUrl, repoProvider: 'unknown' }),
        WELL_KNOWN_REPO_PROVIDERS,
      ),
    ).toThrow();
  });
  describe('custom providers', () => {
    test('known custom provider - no ref', () => {
      const opts = { binderUrl, repoProvider: 'custom', repo: 'sunshine' };
      const spec = {
        name: 'custom',
        makeUrl: (opts: BinderOptions) =>
          `https://custom.host.com/v2/custom/${opts.repo}${opts.ref ? `~~~${opts.ref}` : ''}`,
      };
      const url = makeBinderUrl(opts, [spec]);
      expect(makeBinderUrl(opts, [spec])).toEqual(`https://custom.host.com/v2/custom/sunshine`);
    });
    test('known custom provider - no ref', () => {
      const opts = { binderUrl, repoProvider: 'custom', repo: 'sunshine', ref: 'unicorns' };
      const spec = {
        name: 'custom',
        makeUrl: (opts: BinderOptions) =>
          `https://custom.host.com/v2/custom/${opts.repo}${opts.ref ? `~~~${opts.ref}` : ''}`,
      };
      const url = makeBinderUrl(opts, [spec]);
      expect(makeBinderUrl(opts, [spec])).toEqual(
        `https://custom.host.com/v2/custom/sunshine~~~unicorns`,
      );
    });
  });
});
