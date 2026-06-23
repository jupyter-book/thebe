import {
  ThebeSessionProvider,
  ThebeRenderMimeRegistryProvider,
  useThebeServer,
  useThebeLoader,
} from 'thebe-react';
import { ConnectionStatusTray } from './ConnectionStatusTray';
import { ConnectionErrorTray } from './ConnectionErrorTray';
import { NotebookStatusTray } from './NotebookStatusTray';
import { NotebookErrorTray } from './NotebookErrorTray';
import { AdminPanel } from './AdminPanel';

export function NotebookPage({ children }: React.PropsWithChildren) {
  const { core } = useThebeLoader();
  const { connecting, config, ready, error } = useThebeServer();

  if (!core) return null;

  return (
    <ThebeRenderMimeRegistryProvider>
      <ThebeSessionProvider start path={config?.kernels.path}>
        <>
          {(connecting || ready || error) && (
            <>
              <ConnectionStatusTray />
              <ConnectionErrorTray />
              <NotebookStatusTray />
              <NotebookErrorTray />
              <AdminPanel />
            </>
          )}
          {children}
        </>
      </ThebeSessionProvider>
    </ThebeRenderMimeRegistryProvider>
  );
}
