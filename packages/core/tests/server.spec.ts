import { MessageSubject, ServerStatus } from '../src/messaging';
import ThebeServer from '../src/server';

describe('server', () => {
  test('server unavailable', async () => {
    const messageSpy = jest.fn();
    const server = await ThebeServer.connectToJupyterServer({}, messageSpy);
    expect(server).toBeDefined();
    expect(server.id).toBeDefined();
    expect(messageSpy).toBeCalledTimes(3);
    expect(messageSpy.mock.calls[2][0].subject).toEqual(MessageSubject.server);
    expect(messageSpy.mock.calls[2][0].status).toEqual(ServerStatus.failed);
  });
});
