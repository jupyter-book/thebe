import { describe, test, expect } from 'vitest';
import { WELL_KNOWN_REPO_PROVIDERS, makeBinderUrls } from '../src/url';
import { makeBinderOptions } from '../src/options';
import type { BinderOptions } from '../src/types';

const binderUrl = 'https://binder.curvenote.dev/';

describe('building binder urls', () => {
  describe('well known providers', () => {
    test('git', () => {
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'git' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/HEAD',
        launch: 'https://binder.curvenote.dev/v2/git/executablebooks%2Fthebe-binder-base/HEAD',
      });
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'git', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/main',
        launch: 'https://binder.curvenote.dev/v2/git/executablebooks%2Fthebe-binder-base/main',
      });
    });
    test('gitlab', () => {
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'gitlab' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/HEAD',
        launch: 'https://binder.curvenote.dev/v2/gl/executablebooks%2Fthebe-binder-base/HEAD',
      });
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'gitlab', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/main',
        launch: 'https://binder.curvenote.dev/v2/gl/executablebooks%2Fthebe-binder-base/main',
      });
    });
    test('github', () => {
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'github' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/HEAD',
        launch: 'https://binder.curvenote.dev/v2/gh/executablebooks/thebe-binder-base/HEAD',
      });
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'github', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/main',
        launch: 'https://binder.curvenote.dev/v2/gh/executablebooks/thebe-binder-base/main',
      });
    });
    test('gist', () => {
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'gist' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gist/executablebooks/thebe-binder-base/HEAD',
        launch: 'https://binder.curvenote.dev/v2/gist/executablebooks/thebe-binder-base/HEAD',
      });
      expect(
        makeBinderUrls(
          makeBinderOptions({ binderUrl, repoProvider: 'gist', ref: 'main' }),
          WELL_KNOWN_REPO_PROVIDERS,
        ),
      ).toEqual({
        build: 'https://binder.curvenote.dev/build/gist/executablebooks/thebe-binder-base/main',
        launch: 'https://binder.curvenote.dev/v2/gist/executablebooks/thebe-binder-base/main',
      });
    });
  });
  test('unknown provider throws', () => {
    expect(() =>
      makeBinderUrls(
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
        makeUrls: ({ repo, ref }: BinderOptions) => ({
          build: `https://custom.host.com/build/custom/${repo}${ref ? `~~~${ref}` : ''}`,
          launch: `https://custom.host.com/v2/custom/${repo}${ref ? `~~~${ref}` : ''}`,
        }),
      };
      expect(makeBinderUrls(opts, [spec])).toEqual({
        build: `https://custom.host.com/build/custom/sunshine`,
        launch: `https://custom.host.com/v2/custom/sunshine`,
      });
    });
    test('known custom provider - with ref', () => {
      const opts = { binderUrl, repoProvider: 'custom', repo: 'sunshine', ref: 'unicorns' };
      const spec = {
        name: 'custom',
        makeUrls: ({ repo, ref }: BinderOptions) => ({
          build: `https://custom.host.com/build/custom/${repo}${ref ? `~~~${ref}` : ''}`,
          launch: `https://custom.host.com/v2/custom/${repo}${ref ? `~~~${ref}` : ''}`,
        }),
      };
      expect(makeBinderUrls(opts, [spec])).toEqual({
        build: `https://custom.host.com/build/custom/sunshine~~~unicorns`,
        launch: `https://custom.host.com/v2/custom/sunshine~~~unicorns`,
      });
    });
  });
});
