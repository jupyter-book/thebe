import { useEffect } from 'react';
import { useThebeLoader, useThebeServer } from 'thebe-react';

export function Connect() {
  const { core, loading, load } = useThebeLoader();
  const { ready, connecting, connect } = useThebeServer();

  useEffect(() => {
    if (core || loading) return;
    load();
  }, [core, load, loading]);

  const clickConnect = () => {
    if (!core) return;
    connect();
  };

  return (
    <div className="my-2">
      {!ready && (
        <button className="button" onClick={clickConnect} disabled={!core || connecting}>
          connect
        </button>
      )}
      {ready && (
        <span className="inline-block h-[41px] bg-green-500 text-white font-bold py-2 px-4 rounded-full">
          connected
        </span>
      )}
    </div>
  );
}
