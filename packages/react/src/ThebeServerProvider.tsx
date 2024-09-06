import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Config,
  CoreOptions,
  EventSubject,
  RepoProviderSpec,
  ThebeEventCb,
  ThebeEventData,
  ThebeEvents,
  ThebeServer,
} from 'thebe-core';
import { useThebeLoader } from './ThebeLoaderProvider';

type ListenerFn = (data: ThebeEventData) => void;

export const ThebeServerContext = React.createContext<
  | {
      connecting: boolean;
      ready: boolean;
      config?: Config;
      events?: ThebeEvents;
      server?: ThebeServer;
      error?: string;
      connect?: () => void;
      disconnect?: () => Promise<void>;
    }
  | undefined
>(undefined);

export function ThebeServerProvider({
  connect = true,
  config,
  options,
  useBinder,
  useJupyterLite,
  customConnectFn,
  customRepoProviders,
  events,
  children,
}: React.PropsWithChildren<{
  connect: boolean;
  config?: Config;
  options?: CoreOptions;
  useBinder?: boolean;
  useJupyterLite?: boolean;
  events?: ThebeEvents;
  customConnectFn?: (server: ThebeServer) => Promise<void>;
  customRepoProviders?: RepoProviderSpec[];
}>) {
  const { core } = useThebeLoader();
  const [doConnect, setDoConnect] = useState(connect);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [server, setServer] = useState<ThebeServer | undefined>();
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // create a valid configuration, either using the one supplied
  // or based on the options provided
  // once only - if options/config were to change, we'd need logic to create a new server etc..
  const thebeConfig = useMemo(
    () => config ?? core?.makeConfiguration(options ?? {}, events),
    [core, options],
  );

  // create an iniital server
  useEffect(() => {
    if (!core || !thebeConfig || server) return;
    const svr = new core.ThebeServer(thebeConfig);

    // register an error handler immedately
    const handler = (evt: string, data: ThebeEventData) => {
      const subjects = [
        core.EventSubject.server,
        core.EventSubject.session,
        core.EventSubject.kernel,
      ];
      if (data.subject && subjects.includes(data.subject)) {
        setError(`${data.status} - ${data.message}`);
      }
    };
    // TODO we need a way to unsubscribe from this that does not cause
    // error events to be missed due to rerenders
    thebeConfig.events.on(core.ThebeEventType.error, handler);
    setServer(svr);
  }, [core, thebeConfig, server]);

  const connectToServer = () => {
    if (!server) return;
    setConnecting(true);
    if (customConnectFn) customConnectFn(server);
    else if (useBinder) server.connectToServerViaBinder(customRepoProviders);
    else if (useJupyterLite)
      server.connectToJupyterLiteServer({
        litePluginSettings: {
          '@jupyterlite/pyodide-kernel-extension:kernel': {
            pipliteUrls: ['https://unpkg.com/@jupyterlite/pyodide-kernel@0.4.1/pypi/all.json'],
            pipliteWheelUrl:
              'https://unpkg.com/@jupyterlite/pyodide-kernel@0.4.1/pypi/piplite-0.4.1-py3-none-any.whl',
          },
        },
      });
    else server.connectToJupyterServer();

    server.ready.then(
      () => {
        setConnecting(false);
        setReady(true);
      },
      () => {
        setConnecting(false);
        setReady(false);
      },
    );

    return server.ready;
  };

  // Once the core is loaded, connect to a server
  // TODO: this should be an action not a side effect
  useEffect(() => {
    if (!core || !thebeConfig) return; // TODO is there a better way to keep typescript happy here?
    if (!server || !doConnect) return;
    // do not reconnect if already connected!
    if (server.isReady && server.userServerUrl) return;
    // TODO is the user server really still alive? this would be an async call to server.check
    connectToServer();
  }, [server, doConnect]);

  return (
    <ThebeServerContext.Provider
      value={{
        config: thebeConfig,
        events: events ?? thebeConfig?.events,
        server,
        connecting,
        ready: (server?.isReady ?? false) && ready, // TODO server status may change, affecting readiness
        connect: connectToServer,
        disconnect: async () => {
          if (core && thebeConfig && server) {
            server.dispose();
            setServer(new core.ThebeServer(thebeConfig));
          }
          setReady(false);
          setDoConnect(false);
          setConnecting(false);
          setError(undefined);
        },
        error,
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
  const thebe = useThebeLoader();
  const { core } = thebe ?? {};

  const serverContext = useContext(ThebeServerContext);
  const { config, events, server, connecting, ready, connect, disconnect, error } =
    serverContext ?? {
      ready: false,
      connecting: false,
    };

  const [eventCallbacks, setEventCallbacks] = useState<ThebeEventCb[]>([]);

  const subscribe = useCallback(
    (fn: ListenerFn) => {
      if (!core || !config || !server) return;
      const callbackFn = (evt: string, data: ThebeEventData) => {
        const subjects = [
          core.EventSubject.server,
          core.EventSubject.session,
          core.EventSubject.kernel,
        ];
        if (data.subject && subjects.includes(data.subject)) fn(data);
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

  return serverContext
    ? {
        config,
        events,
        server,
        connecting,
        ready,
        error,
        connect,
        disconnect,
        subscribe,
        unsubAll,
      }
    : { connecting: false, ready: false };
}
