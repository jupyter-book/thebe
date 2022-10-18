import { ThebeNotebook } from 'thebe-core';
import * as thebe from '../src/thebe';
jest.mock('../src/utils');

/**
 * Test the bootstrapping process
 */
describe.only('bootstrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  test('calls pre-render hook', async () => {
    const spy = jest.fn();
    await thebe.bootstrap({ useBinder: false, requestKernel: false, preRenderHook: spy }); // don't wait for kernel
    expect(spy).toHaveBeenCalledTimes(1);
  });
  test('calls strip prompts, when specified in options', async () => {
    await thebe.bootstrap({ useBinder: false, requestKernel: false });
    expect(thebe.stripPrompts).not.toHaveBeenCalled();

    await thebe.bootstrap({
      useBinder: false,
      requestKernel: false,
      stripPrompts: { inPrompt: '%', continuationPrompt: '>>' },
    });
    expect(thebe.stripPrompts).toHaveBeenCalledTimes(1);
  });
  test('calls strip outputPrompts, when specified in options', async () => {
    await thebe.bootstrap({ useBinder: false, requestKernel: false });
    expect(thebe.stripOutputPrompts).not.toHaveBeenCalled();

    await thebe.bootstrap({
      useBinder: false,
      requestKernel: false,
      stripOutputPrompts: { outPrompt: '%:' },
    });
    expect(thebe.stripOutputPrompts).toHaveBeenCalledTimes(1);
  });
  test('Returns server and notebook', async () => {
    const retval = await thebe.bootstrap({ useBinder: false, requestKernel: false });
    expect(retval.server).toBeDefined();
    expect(retval.notebook).toBeDefined();
    expect(retval).not.toHaveProperty('session'); // no server, so cannot start a session
  });
  test('Notebook is empty when no code cells are found', async () => {
    const { notebook } = await thebe.bootstrap({ useBinder: false, requestKernel: false });
    expect(notebook).toBeDefined();
    expect((notebook as ThebeNotebook)?.cells).toHaveLength(0);
  });
  test('Attaches objects to window when thebe is on window', async () => {
    (window as any).thebe = {};
    await thebe.bootstrap({ useBinder: false, requestKernel: false });
    const { thebe: thebeObject } = window as unknown as { thebe: any };
    expect(thebeObject).toBeDefined();
    expect(thebeObject.server).toBeDefined();
    expect(thebeObject.notebook).toBeDefined();
    expect(thebeObject.session).toBeUndefined();
  });
});
