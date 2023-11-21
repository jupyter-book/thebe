import { vi, describe, test, expect } from 'vitest';
import { Config } from '../src/config';
import { ErrorStatusEvent, EventSubject, ThebeEvents } from '../src/events';
import ThebeServer from '../src/server';

describe('server', () => {
  test('server unavailable', async () => {
    const events = new ThebeEvents();
    events.trigger = vi.fn();
    const config = new Config(
      {
        serverSettings: {
          baseUrl: 'http://localhost:9999',
        },
      },
      { events },
    );
    const server = new ThebeServer(config);
    expect(server).toBeDefined();
    expect(server.id).toBeDefined();

    try {
      server.connectToJupyterServer();
      await server.ready;
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err).toContain('Server not reachable (http://localhost:9999/)');
    }

    expect(events.trigger).toBeCalledTimes(2);
    expect((events.trigger as any).mock.calls[1][0]).toEqual(ErrorStatusEvent.error);
    expect((events.trigger as any).mock.calls[1][1].subject).toEqual(EventSubject.server);
    expect((events.trigger as any).mock.calls[1][1].status).toEqual(ErrorStatusEvent.error);
  });
});
