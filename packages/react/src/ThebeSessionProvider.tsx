import React, { useContext, useEffect, useState } from 'react';
import type { ThebeSession } from 'thebe-core';
import { useThebeServer } from './ThebeServerProvider';

interface ThebeSessionContextData {
  name: string;
  session?: ThebeSession;
  starting: boolean;
  ready: boolean;
  error?: string;
  start: () => void;
}

export const ThebeSessionContext = React.createContext<ThebeSessionContextData | undefined>(
  undefined,
);

export function ThebeSessionProvider({
  start = true,
  name = 'default',
  shutdownOnUnmount = false,
  children,
}: React.PropsWithChildren<{
  start: boolean;
  name?: string;
  shutdownOnUnmount?: boolean;
}>) {
  const { config, server, ready: serverReady } = useThebeServer();

  const [doStart, setDoStart] = useState(start);
  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<ThebeSession | undefined>();
  const [error, setError] = useState<string | undefined>();

  /// Once server connection is open, start a session
  useEffect(() => {
    if (!doStart || !server || !serverReady) return;
    setStarting(true);
    server.startNewSession({ ...config?.kernels, name, path: name }).then((sesh) => {
      setStarting(false);
      if (sesh != null) return setSession(sesh);
      server.getKernelSpecs().then((specs) => {
        setError(
          `Could not start a session - available kernels: ${Object.keys(specs.kernelspecs)}`,
        );
      });
    });
  }, [doStart, server, serverReady]);

  // shutdown session on navigate away
  useEffect(() => {
    return () => {
      if (shutdownOnUnmount) session?.shutdown();
    };
  }, [session]);

  const ready = !!session && session.kernel != null;

  return (
    <ThebeSessionContext.Provider
      value={{
        name,
        starting,
        ready,
        session,
        start: () => setDoStart(true),
        error,
      }}
    >
      {children}
    </ThebeSessionContext.Provider>
  );
}

export function useThebeSession(): ThebeSessionContextData {
  const sessionContext = useContext(ThebeSessionContext);
  if (sessionContext === undefined) {
    throw new Error('useThebeSession must be used inside a ThebeServerProvider');
  }
  return sessionContext;
}
