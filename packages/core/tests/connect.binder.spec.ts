import { makeGitHubUrl, makeGitLabUrl, makeGitUrl } from '../src/url';
import { BinderOptions, RepoProvider } from '../src/types';

function makeBinderOptions(repoProvider: RepoProvider, ref = 'main') {
  return {
    repo: 'binder-examples/requirements',
    repoProvider,
    ref,
    binderUrl: 'https://binder.curvenote.dev/',
  } as BinderOptions;
}

describe('connect.binder', () => {
  describe('urls', () => {
    test('git', () => {
      expect(makeGitUrl(makeBinderOptions(RepoProvider.git))).toEqual(
        'https://binder.curvenote.dev/build/git/binder-examples%2Frequirements/main'
      );
      expect(makeGitUrl(makeBinderOptions(RepoProvider.git, 'master'))).toEqual(
        'https://binder.curvenote.dev/build/git/binder-examples%2Frequirements/master'
      );
      expect(() => makeGitUrl(makeBinderOptions(RepoProvider.github))).toThrow();
    });
    test('github', () => {
      expect(makeGitHubUrl(makeBinderOptions(RepoProvider.github))).toEqual(
        'https://binder.curvenote.dev/build/gh/binder-examples/requirements/main'
      );
      expect(makeGitHubUrl(makeBinderOptions(RepoProvider.github, 'master'))).toEqual(
        'https://binder.curvenote.dev/build/gh/binder-examples/requirements/master'
      );
      expect(() => makeGitHubUrl(makeBinderOptions(RepoProvider.git))).toThrow();
    });
    test('gitlab', () => {
      expect(makeGitLabUrl(makeBinderOptions(RepoProvider.gitlab))).toEqual(
        'https://binder.curvenote.dev/build/gl/binder-examples%2Frequirements/main'
      );
      expect(makeGitLabUrl(makeBinderOptions(RepoProvider.gitlab, 'master'))).toEqual(
        'https://binder.curvenote.dev/build/gl/binder-examples%2Frequirements/master'
      );
      expect(() => makeGitLabUrl(makeBinderOptions(RepoProvider.git))).toThrow();
    });
  });
});
