import { useState, useEffect } from 'react';
import { ThebeEventData, ThebeEventType, EventSubject } from 'thebe-core';
import { useThebeConfig } from 'thebe-react';

export function NotebookStatusTray() {
  const { config } = useThebeConfig();
  const [status, setStatus] = useState<ThebeEventData | null>(null);

  useEffect(() => {
    if (!config?.events) return;
    config?.events?.on('status' as ThebeEventType, (event: any, data: ThebeEventData) => {
      // report status events related to execution only
      if ([EventSubject.notebook, EventSubject.cell].includes(data.subject as EventSubject)) {
        setStatus(data);
      }
    });
  }, [config]);

  return (
    <div className="mono not-prose max-w-[80%] m-auto min-h-[3em] border-[1px] border-blue-500 relative pb-1 mt-2">
      <div className="absolute px-1 py-[1px] text-xs text-white bg-blue-500">
        notebook/cell status
      </div>
      {status && (
        <details className="flex justify-center text-center mono" open>
          <summary>last status: {`[${status.subject}] ${status.status} ${status.id}`}</summary>
          <div className="text-xs whitespace-pre-wrap">{status.message}</div>
        </details>
      )}
      <div></div>
    </div>
  );
}
