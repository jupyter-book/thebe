import React, { useContext, useEffect, useState } from 'react';
import type { ThebeSession } from 'thebe-core';
import { useThebeServer } from './ThebeServerProvider';
import { useRenderMimeRegistry } from './ThebeRenderMimeRegistryProvider';
import { ThebeEventData } from 'thebe-core';
import { useThebeLoader } from './ThebeLoaderProvider';

interface ThebeSessionContextData {
  path?: string;
  session?: ThebeSession;
  error?: string;
  starting: boolean;
  ready: boolean;
  start?: () => Promise<void>;
  shutdown?: () => Promise<void>;
}

export const ThebeSessionContext = React.createContext<ThebeSessionContextData | undefined>(
  undefined,
);

export function ThebeSessionProvider({
  start = true,
  path,
  shutdownOnUnmount = false,
  children,
}: React.PropsWithChildren<{
  start?: boolean;
  path?: string;
  shutdownOnUnmount?: boolean;
}>) {
  const { core } = useThebeLoader();
  const { config, server, ready: serverReady } = useThebeServer();
  const rendermime = useRenderMimeRegistry();

  const [doStart, setDoStart] = useState(start);
  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<ThebeSession | undefined>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | undefined>();

  /// Once server connection is open, auto start a session if start prop is true
  useEffect(() => {
    if (!server || !serverReady || !doStart || starting || ready) return;
    startSession();
  }, [ready, doStart, starting, server, serverReady]);

  // register an event handler to monitor for session status changes
  useEffect(() => {
    if (!core || !config || !session) return;
    const handler = (evt: string, data: ThebeEventData) => {
      const subjects = [core.EventSubject.session, core.EventSubject.kernel];
      if (
        data.subject &&
        subjects.includes(data.subject) &&
        data.status === 'shutdown' &&
        data.id === session.id
      ) {
        setError(`session ${session.path} - ${data.status} - ${data.message}`);
      }
    };
    setUnsubscribe(config.events.on(core.ThebeEventType.status, handler));
  }, [core, config, session]);

  const startSession = () => {
    if (!rendermime) throw new Error('ThebeSessionProvider requires a RenderMimeRegistryProvider');
    setStarting(true);
    server?.startNewSession(rendermime, { path }).then(
      (sesh: ThebeSession | null) => {
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
      },
      (err: any) => {
        setError(typeof err === 'object' ? err.message : JSON.stringify(err));
        setReady(false);
        setDoStart(false);
        setStarting(false);
      },
    );
  };

  // shutdown session on navigate away
  useEffect(() => {
    return () => {
      if (shutdownOnUnmount) {
        unsubscribe?.();
        setUnsubscribe(undefined);
        session?.shutdown().then(() => {
          setReady(false);
          setStarting(false);
          setError(undefined);
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
            unsubscribe?.();
            setUnsubscribe(undefined);
            await session.shutdown();
            setSession(undefined);
            setReady(false);
            setStarting(false);
            setError(undefined);
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
  return sessionContext ?? { starting: false, ready: false };
}
