import { describe, test, expect } from 'vitest';

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
        repo: 'executablebooks/thebe-binder-base',
        ref: 'HEAD',
        binderUrl: 'https://mybinder.org',
        repoProvider: 'github',
      });
    });
    test('override all', () => {
      expect(
        makeBinderOptions({
          repo: 'abc',
          ref: 'x',
          binderUrl: 'anystring',
          repoProvider: 'git',
        }),
      ).toEqual({
        repo: 'abc',
        ref: 'x',
        binderUrl: 'anystring',
        repoProvider: 'git',
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
        kernelName: 'python',
      });
    });
    test('overrides', () => {
      expect(
        makeKernelOptions({
          path: '/notebooks',
          kernelName: 'ijpl1',
        }),
      ).toEqual({
        path: '/notebooks',
        kernelName: 'ijpl1',
      });
    });
    test('overrides - missing name', () => {
      expect(
        makeKernelOptions({
          path: '/notebooks',
          kernelName: 'ijpl1',
        }),
      ).toEqual({
        path: '/notebooks',
        kernelName: 'ijpl1',
      });
    });
  });
  describe('server settings', () => {
    test('defaults', () => {
      expect(makeServerSettings({})).toEqual(
        expect.objectContaining({
          baseUrl: 'http://localhost:8888',
          token: expect.any(String),
          appendToken: true,
          wsUrl: 'ws://localhost:8888',
        }),
      );
    });
    test('overrides', () => {
      expect(
        makeServerSettings({
          baseUrl: 'any-string',
          token: 'any-token-string',
          appendToken: false,
          wsUrl: 'any-string',
        }),
      ).toEqual({
        baseUrl: 'any-string',
        token: 'any-token-string',
        appendToken: false,
        wsUrl: 'any-string',
      });
    });
  });
});
