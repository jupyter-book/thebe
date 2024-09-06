import React, { useEffect, useState } from 'react';
import version from './version';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type ThebeCore = typeof import('thebe-core');

// Don't know how to get rid of the undefined here in the case of an async provider
const ThebeLoaderContext = React.createContext<
  { core?: ThebeCore; error?: string; loading: boolean; load: () => void } | undefined
>(undefined);

export function ThebeLoaderProvider({
  start,
  children,
}: React.PropsWithChildren<{ start?: boolean }>) {
  const [startLoad, setStartLoad] = useState(start);
  const [loading, setLoading] = useState(false);
  const [core, setCore] = useState<ThebeCore | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // if already loaded do nothing
    if (!startLoad || core) return;
    setLoading(true);
    console.debug(`thebe-react (v${version}) importing thebe-core...`);
    import('thebe-core')
      .then((thebeCore) => {
        console.debug(`thebe-core (v${thebeCore.version}) loaded`);
        setCore(thebeCore);
        setLoading(false);
      })
      .catch(({ message }) => {
        console.debug(`thebe-core load failed ${message}`);
        setError(message);
        setLoading(false);
      });
  }, [startLoad]);

  return (
    <ThebeLoaderContext.Provider value={{ core, error, loading, load: () => setStartLoad(true) }}>
      <>{children}</>
    </ThebeLoaderContext.Provider>
  );
}

export function ThebeBundleLoaderProvider({
  start,
  loadThebeLite,
  publicPath,
  children,
  options = {},
}: React.PropsWithChildren<{
  start?: boolean;
  loadThebeLite?: boolean;
  publicPath?: string;
  options?: { attempts?: number; delay?: number };
}>) {
  const [startLoad, setStartLoad] = useState(start);
  const [loading, setLoading] = useState(false);
  const [core, setCore] = useState<ThebeCore | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // if already loaded do nothing
    if (!startLoad || core) return;
    setLoading(true);
    console.debug(`thebe-react (v${version}) importing thebe-core...`);

    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      try {
        if (!window.thebeCore) {
          const script = document.createElement('script');
          script.setAttribute('src', `${publicPath ?? ''}/thebe-core.min.js`);
          script.setAttribute('async', 'true');
          script.setAttribute('type', 'text/javascript');
          document.head.appendChild(script);
        }

        if (loadThebeLite) {
          const liteScript = document.createElement('script');
          liteScript.setAttribute('src', `${publicPath ?? ''}/thebe-lite.min.js`);
          liteScript.setAttribute('async', 'true');
          liteScript.setAttribute('type', 'text/javascript');
          document.head.appendChild(liteScript);
        }

        let attempts = 0;
        const timer = setInterval(() => {
          if (window.thebeCore && (window.thebeLite || !loadThebeLite)) {
            setLoading(false);
            setCore((window as any).thebeCore?.module);
            console.debug(`thebe-core (v${(window as any).thebeCore?.version ?? '0'}) loaded`);
            if (window.thebeLite)
              console.debug(`thebe-lite (v${window.thebeLite?.version ?? '0'}) loaded`);
            clearInterval(timer);
          }
          if (attempts > (options?.attempts ?? 50)) {
            setError('thebe-core load failed');
            setLoading(false);
            clearInterval(timer);
            console.warn('thebe load timed out');
            if (!window.thebeCore) console.debug('thebe-core failed to load');
            if (!window.thebeLite) console.debug('thebe-lite failed to load');
          }
          attempts += 1;
        }, options?.delay ?? 300);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }
  }, [startLoad]);

  return (
    <ThebeLoaderContext.Provider value={{ core, error, loading, load: () => setStartLoad(true) }}>
      <>{children}</>
    </ThebeLoaderContext.Provider>
  );
}

export function useThebeLoader() {
  const context = React.useContext(ThebeLoaderContext);
  return context ?? { loading: false, load: () => ({}) };
}
