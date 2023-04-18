import React, { useContext, useEffect, useState } from 'react';
import type { ThebeSession } from 'thebe-core';
import { useThebeServer } from './ThebeServerProvider';

interface ThebeSessionContextData {
  name: string;
  session?: ThebeSession;
  starting: boolean;
  ready: boolean;
  error?: string;
  start: () => Promise<void>;
  shutdown: () => Promise<void>;
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
  start?: boolean;
  name?: string;
  shutdownOnUnmount?: boolean;
}>) {
  const { config, server, ready: serverReady } = useThebeServer();

  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<ThebeSession | undefined>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const startSession = () => {
    setStarting(true);
    server
      ?.startNewSession({ ...config?.kernels, name, path: name })
      .then((sesh: ThebeSession | null) => {
        setStarting(false);
        if (sesh == null) {
          server?.getKernelSpecs().then((specs) => {
            setError(
              `Could not start a session - available kernels: ${Object.keys(specs.kernelspecs)}`,
            );
          });
          return;
        }
        setSession(sesh);
        setReady(true); // not this could use the thebe event mechanism
      });
  };

  /// Once server connection is open, auto start a session if start prop is true
  useEffect(() => {
    if (!server || !serverReady || !starting || !start) return;
    startSession();
  }, [start, starting, server, serverReady]);

  // shutdown session on navigate away
  useEffect(() => {
    return () => {
      if (shutdownOnUnmount) {
        session?.shutdown().then(() => {
          setReady(false);
        });
      }
    };
  }, [session]);

  // const ready = !!session && session.kernel != null;

  return (
    <ThebeSessionContext.Provider
      value={{
        name,
        starting,
        ready,
        session,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        start: async () => {
          if (!!session && ready) {
            await session.shutdown();
            setReady(false);
          }
          startSession();
        },
        shutdown: async () => {
          if (session) {
            await session.shutdown();
            setReady(false);
          }
        },
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
    throw new Error('useThebeSession must be used inside a ThebeSessionProvider');
  }
  return sessionContext;
}
