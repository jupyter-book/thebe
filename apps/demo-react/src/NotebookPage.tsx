import { ThebeSessionProvider, ThebeRenderMimeRegistryProvider, useThebeServer } from 'thebe-react';

export function NotebookPage({ children }: React.PropsWithChildren) {
  const { ready, config } = useThebeServer();

  if (!ready) return null;
  return (
    <ThebeRenderMimeRegistryProvider>
      <ThebeSessionProvider start path={config?.kernels.path}>
        {children}
      </ThebeSessionProvider>
    </ThebeRenderMimeRegistryProvider>
  );
}
