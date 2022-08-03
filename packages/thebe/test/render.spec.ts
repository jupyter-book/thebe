import * as thebe from '../src';
import { appendConfig, appendElementToBody } from './helpers';

describe('render', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  // TODO: consider using karma-fixture
  test.skip('cell rendering (default)', async () => {
    appendElementToBody('pre', 'data-executable', null);

    await thebe.bootstrap();

    const cells = document.body.getElementsByClassName('thebe-input');
    expect(cells.length).toEqual(1);
  });
  test('cell rendering (selector)', async () => {
    appendElementToBody('div', null, 'mycode');

    await thebe.bootstrap({ selector: '.mycode' });

    const cells = document.body.getElementsByClassName('thebe-input');
    expect(cells.length).toEqual(1);
  });
  test('output preview rendering (default)', async () => {
    // output must be preceeded by a executable cell
    appendElementToBody('pre', 'data-executable', null);
    appendElementToBody('div', 'data-output', null);

    await thebe.bootstrap();

    const outputs = document.body.getElementsByClassName('thebe-output');
    expect(outputs.length).toEqual(1);
  });
  test('output preview rendering (selector)', async () => {
    appendElementToBody('pre', 'data-executable', null);
    appendElementToBody('div', null, 'mypreview');

    await thebe.bootstrap({ outputSelector: 'div.mypreview' }); // don't wait for kernel

    const outputs = document.body.getElementsByClassName('thebe-output');
    expect(outputs.length).toEqual(1);
  });
});
