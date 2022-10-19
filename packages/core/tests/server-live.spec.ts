import { JupyterServer } from '@jupyterlab/testutils';
let server: JupyterServer | undefined;

describe('server live', () => {
  beforeAll(async () => {
    console.log('Starting Jupyter Test Server');
    server = new JupyterServer();
    await server?.start();
  }, 30000);

  afterAll(async () => {
    await server?.shutdown();
  }, 30000);

  test('check environment', () => {
    expect(server).toBeDefined();
  });
});
