import { useEffect, useState } from 'react';
import { EventSubject, ThebeEventData, ThebeEventType } from 'thebe-core';
import { useThebeConfig } from 'thebe-react';

export function NotebookErrorTray() {
  const { config } = useThebeConfig();
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [errorEvent, setErrorEvent] = useState<ThebeEventData | null>(null);

  useEffect(() => {
    if (!config?.events || subscribed) return;
    config?.events?.on('error' as ThebeEventType, (event: any, data: ThebeEventData) => {
      // report status events reelated to the server or session connection only
      if ([EventSubject.notebook, EventSubject.cell].includes(data.subject as EventSubject)) {
        setErrorEvent(data);
      }
    });
    setSubscribed(true);
  }, [config, subscribed]);

  if (!errorEvent) return null;

  return (
    <div className="mono not-prose max-w-[80%] m-auto min-h-[3em] border-[1px] border-red-500 relative text-red-500 mt-2">
      <div className="absolute px-1 py-[1px] text-xs text-white bg-red-500">
        notebook/cell error
      </div>
      <details className="flex justify-center text-center mono" open>
        <summary>
          last status: {`[${errorEvent.subject}] ${errorEvent.status} ${errorEvent.id}`}
        </summary>
        <div className="text-xs whitespace-pre-wrap">{errorEvent.message}</div>
      </details>
    </div>
  );
}
