import { ThebeSessionProvider, useThebeServer } from 'thebe-react';

export function NotebookPage({ name, children }: React.PropsWithChildren<{ name: string }>) {
  const { ready } = useThebeServer();

  if (!ready) return null;
  return (
    <ThebeSessionProvider start name={name}>
      {children}
    </ThebeSessionProvider>
  );
}
