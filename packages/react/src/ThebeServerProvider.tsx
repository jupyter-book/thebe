import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Config,
  CoreOptions,
  ThebeEventCb,
  ThebeEventData,
  ThebeEvents,
  ThebeServer,
} from 'thebe-core';
import { useThebeCore } from './ThebeCoreProvider';

type ListenerFn = (data: ThebeEventData) => void;

export const ThebeServerContext = React.createContext<
  | {
      config?: Config;
      events?: ThebeEvents;
      server?: ThebeServer;
      connecting: boolean;
      ready: boolean;
      connect: () => void;
    }
  | undefined
>(undefined);

export function ThebeServerProvider({
  connect = true,
  config,
  options,
  useBinder,
  customConnectFn,
  events,
  children,
}: React.PropsWithChildren<{
  connect: boolean;
  config?: Config;
  options?: CoreOptions;
  useBinder?: boolean;
  events?: ThebeEvents;
  customConnectFn?: (server: ThebeServer) => Promise<void>;
}>) {
  const { core } = useThebeCore();
  const [doConnect, setDoConnect] = useState(connect);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  // create a valid configuration, either using the one supplied
  // or based on the options provided
  // once only - if options/config were to change, we'd need logic to create a new server etc..
  const thebeConfig = useMemo(
    () => config ?? core?.makeConfiguration(options ?? {}, events),
    [core, options],
  );

  // because core is async, server is still maybe undefined, but can be created before
  // the connection function is kicked off
  const server = useMemo(() => {
    if (!core || !thebeConfig) return;
    return new core.ThebeServer(thebeConfig);
  }, [core, thebeConfig]);

  // Once the core is loaded, connect to a server
  useEffect(() => {
    if (!core || !thebeConfig) return; // TODO is there a better way to keep typescript happy here?
    if (!server || !doConnect) return;
    setConnecting(true);
    if (customConnectFn) customConnectFn(server);
    else if (useBinder) server.connectToServerViaBinder();
    else server.connectToJupyterServer();
    server.ready.then(() => {
      setConnecting(false);
      setReady(true);
    });
  }, [server, doConnect]);

  return (
    <ThebeServerContext.Provider
      value={{
        config: thebeConfig,
        events: events ?? thebeConfig?.events,
        server,
        connecting,
        ready: (server?.isReady ?? false) && ready, // TODO server status may change, affecting readiness
        connect: () => setDoConnect(true),
      }}
    >
      {children}
    </ThebeServerContext.Provider>
  );
}

export function useThebeConfig() {
  const serverContext = useContext(ThebeServerContext);
  if (serverContext === undefined) {
    throw new Error('useThebeServer must be used inside a ThebeServerProvider');
  }
  return { config: serverContext.config };
}

export function useDisposeThebeServer() {
  const [disposed, setDisposed] = useState(false);

  const serverContext = useContext(ThebeServerContext);
  if (serverContext === undefined) {
    throw new Error('useThebeServer must be used inside a ThebeServerProvider');
  }

  const { server, ready } = serverContext;

  useEffect(() => {
    if (!server || !ready) return;
    Promise.resolve().then(async () => {
      await server.shutdownAllSessions();
      server.dispose();
      setDisposed(true);
    });
  }, [ready, server]);

  return disposed;
}

export function useThebeServer() {
  const serverContext = useContext(ThebeServerContext);
  if (serverContext === undefined) {
    throw new Error('useThebeServer must be used inside a ThebeServerProvider');
  }
  const { config, events, server, connecting, ready, connect } = serverContext;

  const { core } = useThebeCore();
  const [error, setError] = useState<string | undefined>(); // TODO how to handle errors better via the provider
  const [eventCallbacks, setEventCallbacks] = useState<ThebeEventCb[]>([]);

  // configure error handling
  useEffect(() => {
    if (!core || !config || !server) return;
    const handler = (evt: string, data: ThebeEventData) => {
      if (data.id === server?.id) setError(`${data.status} - ${data.message}`);
    };
    config?.events.on(core.ThebeEventType.error, handler);
    return () => config.events.off(core.ThebeEventType.error, handler);
  }, [config, server]);

  const subscribe = useCallback(
    (fn: ListenerFn) => {
      if (!core || !config || !server) return;
      const callbackFn = (evt: string, data: ThebeEventData) => {
        if (data.id === server?.id) fn(data);
      };
      config?.events.on(core.ThebeEventType.status, callbackFn);
      setEventCallbacks([...eventCallbacks, callbackFn]);
    },
    [config, server],
  );

  const unsubAll = useCallback(() => {
    if (!core) return;
    eventCallbacks.forEach((cb) => {
      config?.events.off(core.ThebeEventType.status, cb);
    });
    setEventCallbacks([]);
  }, [config, server]);

  return {
    config,
    events,
    server,
    connecting,
    ready,
    error,
    connect,
    subscribe,
    unsubAll,
  };
}
