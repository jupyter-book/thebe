import { useState } from 'react';
import { useThebeServer, useThebeSession } from 'thebe-react';

function KernelCard({ name, path, kernel }: { name: string; path: string; kernel: any }) {
  return (
    <div className="border-[1px] border-gray-800 rounded shadow p-2 mb-2 gap-1">
      <div className="flex justify-between">
        <div className="font-semibold">{name}</div>
        <div className="ml-1 font-light mono">[{kernel.name}]</div>
      </div>
      <div className="text-xs">path: {path}</div>
    </div>
  );
}

export function AdminPanel() {
  const { ready: serverReady, server } = useThebeServer();
  const { ready: sessionReady, shutdown } = useThebeSession();
  const [open, setOpen] = useState<boolean>(false);
  const [output, setOutput] = useState<any>('...');

  const ready = serverReady && sessionReady;

  const listRunning = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!server) setOutput('no server');
    server
      ?.listRunningSessions()
      .then((data: any) => {
        setOutput(
          <div className="flex flex-wrap gap-3">
            {data.map((k: any) => (
              <KernelCard {...k} />
            ))}
          </div>,
        );
      })
      .catch((err: { message: string }) => {
        setOutput(err.message);
      });
  };

  const shutdownSession = async (e: React.MouseEvent) => {
    e.stopPropagation();
    shutdown?.()
      .then((data: any) => {
        setOutput('session shutdown');
      })
      .catch((err: { message: string }) => {
        setOutput(err.message);
      });
  };

  return (
    <div
      className="mono not-prose max-w-[80%] m-auto min-h-[1.2em] mt-2 border-[1px] border-gray-800 relative pb-1 cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="absolute px-1 py-[1px] text-xs text-white bg-gray-800">admin panel</div>
      {open && ready && (
        <div className="flex flex-col">
          <div className="flex gap-1 p-3 mt-3">
            <div>
              <button
                className="border-[1px] px-2 py1 border-gray-400 hover:border-black rounded shadow font-semibold"
                onClick={listRunning}
              >
                list running kernels
              </button>
            </div>
            <div>
              <button
                className="border-[1px] px-2 py1 border-gray-400 hover:border-black rounded shadow font-semibold"
                onClick={shutdownSession}
              >
                shutdown session
              </button>
            </div>
          </div>
          <pre className="p-3 text-left">{output}</pre>
        </div>
      )}
    </div>
  );
}
