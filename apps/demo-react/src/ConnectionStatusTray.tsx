import { useState, useEffect } from 'react';
import { ThebeEventData, ThebeEventType, EventSubject } from 'thebe-core';
import { useThebeServer } from 'thebe-react';

export function ConnectionStatusTray() {
  const { connecting, events } = useThebeServer();
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [status, setStatus] = useState<ThebeEventData | null>(null);

  useEffect(() => {
    if (!events || subscribed) return;
    events?.on('status' as ThebeEventType, (event: any, data: ThebeEventData) => {
      // report status events reelated to the server or session connection only
      if (
        [EventSubject.server, EventSubject.session, EventSubject.kernel].includes(
          data.subject as EventSubject,
        )
      ) {
        setStatus(data);
      }
    });
    setSubscribed(true);
  }, [events, subscribed]);

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
