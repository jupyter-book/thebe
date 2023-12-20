import { describe, test, expect } from 'vitest';
import { makeDefaultStorageKey } from '../src/sessions';

describe('session saving', () => {
  describe('make storage key', () => {
    test.each([
      [
        'https://mybinder.org/v2/gh/nteract/thebe/master',
        'prefix-https://mybinder.org/v2/gh/nteract/thebe/master',
      ],
      [
        'https://mybinder.org/v2/gh/nteract/thebe/master#ignored',
        'prefix-https://mybinder.org/v2/gh/nteract/thebe/master',
      ],
      [
        'https://mybinder.org/v2/gh/nteract/thebe/master?ignored=1&a=42',
        'prefix-https://mybinder.org/v2/gh/nteract/thebe/master',
      ],
      ['https://mybinder.org/', 'prefix-https://mybinder.org/'],
      ['https://mybinder.org:1234/', 'prefix-https://mybinder.org:1234/'],
    ])('%s', (url, result) => {
      expect(makeDefaultStorageKey('prefix', url)).toEqual(result);
    });
  });
});
