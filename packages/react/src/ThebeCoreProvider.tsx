import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type ThebeCore = typeof import('thebe-core');

// Don;t know how to get rid of the undefined here in the case of an async provider
const ThebeCoreContext = React.createContext<
  { core?: ThebeCore; error?: string; loading: boolean; load: () => void } | undefined
>(undefined);

export function ThebeCoreProvider({
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
      .catch(({ reason }) => {
        console.debug(`thebe-core load failed ${reason}`);
        setError(reason);
        setLoading(false);
      });
  }, [startLoad]);

  return (
    <ThebeCoreContext.Provider value={{ core, error, loading, load: () => setStartLoad(true) }}>
      <>{children}</>
    </ThebeCoreContext.Provider>
  );
}

export function useThebeCore() {
  const context = React.useContext(ThebeCoreContext);
  if (context === undefined) {
    throw new Error('useThebeCore must be used inside a ThebeCoreProvider');
  }
  return context;
}
