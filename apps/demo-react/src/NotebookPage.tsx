import { ThebeSessionProvider, ThebeRenderMimeRegistryProvider, useThebeServer } from 'thebe-react';
import { ConnectionStatusTray } from './ConnectionStatusTray';
import { ConnectionErrorTray } from './ConnectionErrorTray';
import { NotebookStatusTray } from './NotebookStatusTray';
import { NotebookErrorTray } from './NotebookErrorTray';

export function NotebookPage({ children }: React.PropsWithChildren) {
  const { connecting, ready, config } = useThebeServer();

  if (!connecting && !ready) return null;
  return (
    <ThebeRenderMimeRegistryProvider>
      <ThebeSessionProvider start path={config?.kernels.path}>
        <>
          <ConnectionStatusTray />
          <ConnectionErrorTray />
          <NotebookStatusTray />
          <NotebookErrorTray />
          {children}
        </>
      </ThebeSessionProvider>
    </ThebeRenderMimeRegistryProvider>
  );
}
