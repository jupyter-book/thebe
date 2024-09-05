import React from 'react';
import type { IRenderMimeRegistry } from 'thebe-core';
import { useThebeLoader } from './ThebeLoaderProvider';
import { useThebeConfig } from './ThebeServerProvider';

const RenderMimeRegistryContext = React.createContext<
  { rendermime: IRenderMimeRegistry } | undefined
>(undefined);

/* future: could allow for renderer configuration here */
export function ThebeRenderMimeRegistryProvider({ children }: React.PropsWithChildren) {
  const { core } = useThebeLoader();
  const { config } = useThebeConfig();
  const rendermime = React.useMemo(
    () => core?.makeRenderMimeRegistry(config?.mathjax) as IRenderMimeRegistry,
    [core, config],
  );

  return (
    <RenderMimeRegistryContext.Provider value={{ rendermime }}>
      {children}
    </RenderMimeRegistryContext.Provider>
  );
}

export function useRenderMimeRegistry() {
  const context = React.useContext(RenderMimeRegistryContext);
  return context?.rendermime;
}
