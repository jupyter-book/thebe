import { toUnicode } from 'punycode';
import * as thebe from '../src/thebe';
jest.mock('../src/utils');

/**
 * Test the bootstrapping process
 */
describe('bootstrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  test('calls pre-render hook', async () => {
    const spy = jest.fn();
    await thebe.bootstrap({ preRenderHook: spy }); // don't wait for kernel
    expect(spy).toHaveBeenCalledTimes(1);
  });
  test('calls strip prompts, when specified in options', async () => {
    await thebe.bootstrap();
    expect(thebe.stripPrompts).not.toHaveBeenCalled();

    await thebe.bootstrap({ stripPrompts: { inPrompt: '%', continuationPrompt: '>>' } });
    expect(thebe.stripPrompts).toHaveBeenCalledTimes(1);
  });
  test('calls strip outputPrompts, when specified in options', async () => {
    await thebe.bootstrap();
    expect(thebe.stripOutputPrompts).not.toHaveBeenCalled();

    await thebe.bootstrap({ stripOutputPrompts: { outPrompt: '%:' } });
    expect(thebe.stripOutputPrompts).toHaveBeenCalledTimes(1);
  });
  test('Returns server and notebook', async () => {
    const retval = await thebe.bootstrap();
    expect(retval.server).toBeDefined();
    expect(retval.notebook).toBeDefined();
    expect(retval.session).toBeUndefined(); // no server, so cannot start a session
  });
  test('Notebook is empty when no code cells are found', async () => {
    const { notebook } = await thebe.bootstrap();
    expect(notebook).toBeDefined();
    expect(notebook.cells).toHaveLength(0);
  });
  test('Attaches objects to window when thebe is on window', async () => {
    (window as any).thebe = {};
    await thebe.bootstrap();
    const { thebe: thebeObject } = window as unknown as { thebe: any };
    expect(thebeObject.options).toBeDefined();
    expect(thebeObject.server).toBeDefined();
    expect(thebeObject.notebook).toBeDefined();
    expect(thebeObject.session).toBeUndefined();
  });
});
