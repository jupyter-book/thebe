import { JupyterServer } from '@jupyterlab/testutils';
let server: JupyterServer | undefined;

beforeAll(async () => {
  server = new JupyterServer();
  await server?.start();
});

afterAll(async () => {
  await server?.shutdown();
});

describe('server', () => {
  test('check environment', () => {
    expect(server).toBeDefined();
  });
});
