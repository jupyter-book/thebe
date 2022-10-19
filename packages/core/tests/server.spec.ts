import { Config } from '../src/config';
import { MessageSubject, ServerStatus } from '../src/messaging';
import ThebeServer from '../src/server';

describe('server', () => {
  test('server unavailable', async () => {
    const messageSpy = jest.fn();
    const config = new Config({
      serverSettings: {
        baseUrl: 'http://localhost:9999',
      },
    });
    const server = new ThebeServer(config, 'test-server', messageSpy);
    expect(server).toBeDefined();
    expect(server.id).toBeDefined();

    try {
      await server.connectToJupyterServer();
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err).toContain('Server not reachable (http://localhost:9999/)');
    }

    expect(messageSpy).toBeCalledTimes(2);
    expect(messageSpy.mock.calls[1][0].subject).toEqual(MessageSubject.server);
    expect(messageSpy.mock.calls[1][0].status).toEqual(ServerStatus.failed);
  });
});
