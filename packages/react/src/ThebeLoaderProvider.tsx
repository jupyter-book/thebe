import React, { useEffect, useState } from 'react';

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
    console.debug('importing thebe-core...');
    import('thebe-core')
      .then((thebeCore) => {
        console.debug('thebe-core loaded');
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
  children,
}: React.PropsWithChildren<{ start?: boolean; loadThebeLite?: boolean }>) {
  const [startLoad, setStartLoad] = useState(start);
  const [loading, setLoading] = useState(false);
  const [core, setCore] = useState<ThebeCore | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // if already loaded do nothing
    if (!startLoad || core) return;
    setLoading(true);
    console.debug('importing thebe-core...');

    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      try {
        if (!window.thebeCore) {
          const script = document.createElement('script');
          script.setAttribute('src', '/thebe-core.min.js');
          script.setAttribute('async', 'true');
          script.setAttribute('type', 'text/javascript');
          document.head.appendChild(script);

          const styles = document.createElement('link');
          styles.setAttribute('rel', 'stylesheet');
          styles.setAttribute('href', '/thebe-core.css');
          document.head.appendChild(styles);
        }

        if (loadThebeLite) {
          const liteScript = document.createElement('script');
          liteScript.setAttribute('src', '/thebe-lite.min.js');
          liteScript.setAttribute('async', 'true');
          liteScript.setAttribute('type', 'text/javascript');
          document.head.appendChild(liteScript);
        }

        let attempts = 0;
        const timer = setInterval(() => {
          if (window.thebeCore && (window.thebeLite || !loadThebeLite)) {
            setLoading(false);
            setCore((window as any).thebeCore?.module);
            console.debug('thebe-core loaded');
            if (window.thebeLite) console.debug('thebe-lite loaded');
            clearInterval(timer);
          }
          if (attempts > 10) {
            setError('thebe-core load failed');
            setLoading(false);
            clearInterval(timer);
            console.warn('thebe load timed out');
            if (!window.thebeCore) console.debug('thebe-core failed to load');
            if (!window.thebeLite) console.debug('thebe-lite failed to load');
          }
          attempts += 1;
        }, 300);
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
  if (context === undefined) {
    throw new Error(
      'useThebeLoader must be used inside a ThebeLoaderProvider or ThebeBundleLoaderProvider',
    );
  }
  return context;
}
