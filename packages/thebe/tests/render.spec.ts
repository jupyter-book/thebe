import * as thebe from '../src';
import { appendElementToBody } from './helpers';
import type { JupyterServer } from '@jupyterlab/testutils';

let server: JupyterServer | undefined;

describe('render', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  // TODO: consider using karma-fixture
  test('cell rendering (default)', async () => {
    appendElementToBody('pre', 'data-executable', null);

    try {
      await thebe.bootstrap({ useBinder: false, requestKernel: false });
    } catch (err: any) {}

    const cells = document.body.getElementsByClassName('thebe-input');
    expect(cells.length).toEqual(1);
  });
  test('cell rendering (selector)', async () => {
    appendElementToBody('div', null, 'mycode');

    try {
      await thebe.bootstrap({ useBinder: false, requestKernel: false, selector: '.mycode' });
    } catch (err: any) {}

    const cells = document.body.getElementsByClassName('thebe-input');
    expect(cells.length).toEqual(1);
  });
  test('output preview rendering (default)', async () => {
    // output must be preceeded by a executable cell
    appendElementToBody('pre', 'data-executable', null);
    appendElementToBody('div', 'data-output', null);

    try {
      await thebe.bootstrap({ useBinder: false, requestKernel: false });
    } catch (err: any) {}

    const outputs = document.body.getElementsByClassName('thebe-output');
    expect(outputs.length).toEqual(1);
  });
  test('output preview rendering (selector)', async () => {
    appendElementToBody('pre', 'data-executable', null);
    appendElementToBody('div', null, 'mypreview');

    try {
      await thebe.bootstrap({
        useBinder: false,
        requestKernel: false,
        outputSelector: 'div.mypreview',
      }); // don't wait for kernel
    } catch (err: any) {}

    const outputs = document.body.getElementsByClassName('thebe-output');
    expect(outputs.length).toEqual(1);
  });
});
