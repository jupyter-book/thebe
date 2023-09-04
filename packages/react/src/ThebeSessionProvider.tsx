import React, { useContext, useEffect, useState } from 'react';
import type { ThebeSession } from 'thebe-core';
import { useThebeServer } from './ThebeServerProvider';
import { useRenderMimeRegistry } from './ThebeRenderMimeRegistryProvider';

interface ThebeSessionContextData {
  path?: string;
  session?: ThebeSession;
  error?: string;
  starting?: boolean;
  ready?: boolean;
  start?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}

export const ThebeSessionContext = React.createContext<ThebeSessionContextData | undefined>(
  undefined,
);

export function ThebeSessionProvider({
  start = true,
  path = '/thebe.ipynb',
  shutdownOnUnmount = false,
  children,
}: React.PropsWithChildren<{
  start?: boolean;
  path?: string;
  shutdownOnUnmount?: boolean;
}>) {
  const { config, server, ready: serverReady } = useThebeServer();
  const rendermime = useRenderMimeRegistry();

  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<ThebeSession | undefined>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const startSession = () => {
    if (!rendermime) throw new Error('ThebeSessionProvider requires a RenderMimeRegistryProvider');
    setStarting(true);
    server
      ?.startNewSession(rendermime, { ...config?.kernels, path })
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
    if (!server || !serverReady || !start || starting || ready) return;
    startSession();
  }, [ready, start, starting, server, serverReady]);

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

  return (
    <ThebeSessionContext.Provider
      value={{
        path,
        starting,
        ready,
        session,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        start: async () => {
          if (!!session && ready) {
            await session.restart();
          } else {
            startSession();
          }
        },
        shutdown: async () => {
          if (session) {
            await session.shutdown();
            setSession(undefined);
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
  return sessionContext ?? {};
}
