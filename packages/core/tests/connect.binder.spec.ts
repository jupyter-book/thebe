import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from '../src/url';
import { RepoProvider } from '../src/types';
import { makeBinderOptions } from '../src/options';

const binderUrl = 'https://binder.curvenote.dev/';

describe('connect.binder', () => {
  describe('urls', () => {
    test('git', () => {
      expect(makeGitUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.git }))).toEqual(
        'https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/HEAD',
      );
      expect(
        makeGitUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.git, ref: 'main' })),
      ).toEqual('https://binder.curvenote.dev/build/git/executablebooks%2Fthebe-binder-base/main');
      expect(() =>
        makeGitUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.github })),
      ).toThrow();
    });
    test('github', () => {
      expect(
        makeGitHubUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.github })),
      ).toEqual('https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/HEAD');
      expect(
        makeGitHubUrl(
          makeBinderOptions({ binderUrl, repoProvider: RepoProvider.github, ref: 'main' }),
        ),
      ).toEqual('https://binder.curvenote.dev/build/gh/executablebooks/thebe-binder-base/main');
      expect(() =>
        makeGitHubUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.git })),
      ).toThrow();
    });
    test('gitlab', () => {
      expect(
        makeGitLabUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.gitlab })),
      ).toEqual('https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/HEAD');
      expect(
        makeGitLabUrl(
          makeBinderOptions({ binderUrl, repoProvider: RepoProvider.gitlab, ref: 'main' }),
        ),
      ).toEqual('https://binder.curvenote.dev/build/gl/executablebooks%2Fthebe-binder-base/main');
      expect(() =>
        makeGitLabUrl(makeBinderOptions({ binderUrl, repoProvider: RepoProvider.git })),
      ).toThrow();
    });
  });
});
