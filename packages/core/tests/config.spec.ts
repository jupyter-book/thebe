import { RepoProvider } from '../src/types';
import { Config } from '../src/config';

let config: Config;
describe('config', () => {
  describe('defaults', () => {
    beforeEach(() => {
      config = new Config();
    });
    test('base', () => {
      expect(config.base).toEqual({
        mathjaxUrl: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js',
        mathjaxConfig: 'TeX-AMS_CHTML-full,Safe',
      });
    });
    test('binder', () => {
      expect(config.binder).toEqual({
        repo: 'binder-examples/requirements',
        ref: 'master',
        binderUrl: 'https://mybinder.org',
        repoProvider: RepoProvider.github,
      });
    });
    test('kernels', () => {
      expect(config.kernels).toEqual({
        path: '/',
        name: 'python',
        kernelName: 'python',
      });
    });
    test('saved sessions', () => {
      expect(config.savedSessions).toEqual({
        enabled: true,
        maxAge: 86400,
        storagePrefix: 'thebe-binder-',
      });
    });
    test('server settings', () => {
      expect(config.serverSettings).toEqual({
        baseUrl: 'http://localhost:8888',
        token: 'test-secret',
        appendToken: true,
      });
    });
  });
});
