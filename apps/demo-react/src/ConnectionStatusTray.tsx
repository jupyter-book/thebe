import { useState, useEffect } from 'react';
import { ThebeEventData } from 'thebe-core';
import { useThebeServer } from 'thebe-react';

export function ConnectionStatusTray() {
  const { connecting, subscribe, unsubAll } = useThebeServer();
  const [status, setStatus] = useState<ThebeEventData | null>(null);

  useEffect(() => {
    if (!subscribe) return;
    subscribe((data: ThebeEventData) => {
      setStatus(data);
    });
    return unsubAll;
  }, [subscribe, unsubAll]);

  return (
    <div className="mono not-prose max-w-[80%] m-auto min-h-[3em] border-[1px] border-blue-500 relative pb-1">
      <div className="absolute px-1 py-[1px] text-xs text-white bg-blue-500">connection status</div>
      {connecting && <div className="text-blue-500">connecting to server...</div>}
      {status && (
        <details className="flex justify-center text-center mono" open>
          <summary>last status: {`[${status.subject}] ${status.status}`}</summary>
          <div className="text-xs whitespace-pre-wrap">{status.message}</div>
        </details>
      )}
      <div></div>
    </div>
  );
}
