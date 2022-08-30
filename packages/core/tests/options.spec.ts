import { RepoProvider } from '../src/types';
import {
  makeBinderOptions,
  makeKernelOptions,
  makeSavedSessionOptions,
  makeServerSettings,
} from '../src/options';

describe('options', () => {
  describe('binder', () => {
    test('defaults', () => {
      expect(makeBinderOptions({})).toEqual({
        repo: 'binder-examples/requirements',
        ref: 'master',
        binderUrl: 'https://mybinder.org',
        repoProvider: RepoProvider.github,
      });
    });
    test('override all', () => {
      expect(
        makeBinderOptions({
          repo: 'abc',
          ref: 'x',
          binderUrl: 'anystring',
          repoProvider: RepoProvider.git,
        }),
      ).toEqual({
        repo: 'abc',
        ref: 'x',
        binderUrl: 'anystring',
        repoProvider: RepoProvider.git,
      });
    });
  });
  describe('saved sessions', () => {
    test('defaults', () => {
      expect(makeSavedSessionOptions({})).toEqual({
        enabled: true,
        maxAge: 86400,
        storagePrefix: 'thebe-binder-',
      });
    });
    test('overrides', () => {
      expect(
        makeSavedSessionOptions({
          enabled: false,
          maxAge: 111,
          storagePrefix: 'any-string',
        }),
      ).toEqual({
        enabled: false,
        maxAge: 111,
        storagePrefix: 'any-string',
      });
    });
  });
  describe('kernel options', () => {
    test('defaults', () => {
      expect(makeKernelOptions({})).toEqual({
        path: '/',
        name: 'python',
        kernelName: 'python',
      });
    });
    test('overrides', () => {
      expect(
        makeKernelOptions({
          path: '/notebooks',
          name: 'julia',
          kernelName: 'ijpl1',
        }),
      ).toEqual({
        path: '/notebooks',
        name: 'julia',
        kernelName: 'ijpl1',
      });
    });
  });
  describe('server settings', () => {
    test('defaults', () => {
      expect(makeServerSettings({})).toEqual({
        baseUrl: 'http://localhost:8888',
        token: 'test-secret',
        appendToken: true,
      });
    });
    test('overrides', () => {
      expect(
        makeServerSettings({
          baseUrl: 'any-string',
          token: 'any-token-string',
          appendToken: false,
        }),
      ).toEqual({
        baseUrl: 'any-string',
        token: 'any-token-string',
        appendToken: false,
      });
    });
  });
});
