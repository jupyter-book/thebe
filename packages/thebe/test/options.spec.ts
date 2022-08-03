import { getPageConfig } from '../src';
import { mergeOptions, resetPageConfig, _defaultOptions } from '../src/options';
import { appendElementToBody } from './helpers';

describe('options', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPageConfig();
  });
  describe('getPageConfig', () => {
    test.skip('no page config', () => {
      expect(getPageConfig()).toEqual(_defaultOptions);
    });
    test.skip('empty config tag', () => {
      const el = appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      );
      el.textContent = '';
      expect(getPageConfig()).toEqual(_defaultOptions);
    });
    test('config tag with empty object', () => {
      const el = appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      );
      el.textContent = '{}';
      const cfg = getPageConfig();
      expect(cfg).toEqual(_defaultOptions);
      expect(cfg.bootstrap).toEqual(false);
    });
    test('page config loads', () => {
      const el = appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      );
      el.textContent = '{ bootstrap: true }';
      const cfg = getPageConfig();
      expect(cfg.bootstrap).toEqual(true);
    });
    test('multiple configs on page', () => {
      const el1 = appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      );
      el1.textContent = '{ bootstrap: true }';
      appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      ).textContent = '{ useJupyterLite: true }';

      const cfg = getPageConfig();
      expect(cfg.bootstrap).toEqual(true);
      expect(cfg.useJupyterLite).toEqual(true);
    });
  });
  describe('mergeOptions', () => {
    test('empty options, returns defaults', () => {
      const options = mergeOptions({});
      expect(options).toEqual(_defaultOptions);
    });
    test('multiple calls, always returns a new object', () => {
      const A = mergeOptions({});
      const B = mergeOptions({});
      expect(A).not.toBe(B);
    });
    test('supplied options are merged in', () => {
      const A = mergeOptions({ bootstrap: false });
      expect(A.bootstrap).toEqual(false);

      const B = mergeOptions({ bootstrap: true });
      expect(B.bootstrap).toEqual(true);
    });
    test('on page options always merged first', () => {
      const el = appendElementToBody(
        'script',
        { name: 'type', value: 'text/x-thebe-config' },
        null
      );
      el.textContent = '{ selector: "pre" }';

      const B = mergeOptions({});
      expect(B.selector).toEqual('pre');

      const C = mergeOptions({ selector: '.mycode' });
      expect(C.selector).toEqual('.mycode');
    });
  });
});
