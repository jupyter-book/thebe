import { describe, test, expect } from 'vitest';
import { PYTHON_PARAM, interpolatorFactoryFn } from '../src/hooks/interpolate';

describe('interpolate', () => {
  test.each([
    ['#@param', undefined, undefined, false],
    ['#|@param', undefined, undefined, false],
    ['# @param', undefined, undefined, false],
    ['#| @param', undefined, undefined, false],
    ['A#@param', undefined, undefined, false],
    ['A #@param', undefined, undefined, false],
    ['A = #@param', 'A', '', true],
    ['A = 1#@param', 'A', '1', true],
    ['A = 1 # @param', 'A', '1', true],
    ['A = 1;#@param', 'A', '1', true],
    ['A = 1; #@param', 'A', '1', true],
    ['A = 1; # @param', 'A', '1', true],
    ['A = 1 #| @param', 'A', '1', true],
    ['A = 1#|@param', 'A', '1', true],
    ['A = 1;#|@param', 'A', '1', true],
    ['A = 1; #|@param', 'A', '1', true],
    ['A = 1; #| @param', 'A', '1', true],
  ])('Python Syntax - %s', (str, variable, value, outcome) => {
    expect(PYTHON_PARAM.test(str)).toEqual(outcome);
    if (outcome) {
      const match = str.match(PYTHON_PARAM);
      expect(match).not.toBeNull();
      expect(match?.[1].trim()).toEqual(variable);
      expect(match?.[2].trim()).toEqual(value);
    }
  });
  describe('interpolating python code with assignments', () => {
    test('interpolating - no code', () => {
      const fn = interpolatorFactoryFn({
        A: '1',
      });
      const source = ``;
      const expected = '';

      const result = fn(source);
      expect(result).toEqual(expected);
    });
    test('interpolating - no params, no map', () => {
      const fn = interpolatorFactoryFn({});
      const source = `A = 1
      B = "hello world"`;

      const result = fn(source);
      expect(result).toEqual(source);
    });
    test('interpolating - params, no map', () => {
      const fn = interpolatorFactoryFn({});
      const source = `A = 1 #| @param
      B = "hello world"`;

      const result = fn(source);
      expect(result).toEqual(source);
    });
    test('interpolating - params, no map entry', () => {
      const fn = interpolatorFactoryFn({ B: 'hello python' });
      const source = `A = 1 #| @param
      B = "hello world"`;

      const result = fn(source);
      expect(result).toEqual(source);
    });
    test('interpolating - match string', () => {
      const fn = interpolatorFactoryFn({ B: '"hello python"' });
      const source = `A = 1 #| @param
      B = "hello world" #| @param`;
      const expected = `A = 1 #| @param
      B = "hello python" #| @param {"last":" \\"hello world\\" "}`;

      const result = fn(source);
      expect(result).toEqual(expected);
    });
    test('interpolating - match number', () => {
      const fn = interpolatorFactoryFn({ B: '100' });
      const source = `A = 1 #| @param
      B = "hello world" #| @param`;
      const expected = `A = 1 #| @param
      B = 100 #| @param {"last":" \\"hello world\\" "}`;

      const result = fn(source);
      expect(result).toEqual(expected);
    });
  });
});
