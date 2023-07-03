import { useState, useEffect } from 'react';
import { ThebeEventData, ThebeEventType } from 'thebe-core';
import { useThebeServer } from 'thebe-react';

export function ThebeStatusTray() {
  const { connecting, error, events } = useThebeServer();
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [status, setStatus] = useState<ThebeEventData | null>(null);

  useEffect(() => {
    if (!events || subscribed) return;
    setSubscribed(true);
    events?.on('status' as ThebeEventType, (event: any, data: ThebeEventData) => {
      setStatus(data);
    });
  }, [events, subscribed]);

  return (
    <div className="mono not-prose max-w-[80%] m-auto">
      {connecting && <div className="text-orange-500">connecting to server...</div>}
      {error && <div className="text-red-500">connection error: {error}</div>}
      {status && (
        <details className="flex justify-center text-center mono">
          <summary>last status: {`[${status.subject}] ${status.status}`}</summary>
          <div className="text-xs whitespace-pre-wrap">{status.message}</div>
        </details>
      )}
      <div></div>
    </div>
  );
}
