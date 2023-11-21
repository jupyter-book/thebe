import { useThebeLoader, useThebeServer, useThebeSession } from 'thebe-react';

export function ConnectionErrorTray() {
  const { error: loaderError } = useThebeLoader();
  const { error: serverError } = useThebeServer();
  const { error: sessionError } = useThebeSession();

  const errors = loaderError || serverError || sessionError;

  if (!errors) return null;

  return (
    <div className="mono not-prose max-w-[80%] m-auto min-h-[3em] border-[1px] border-red-500 relative text-red-500 mt-2">
      <div className="absolute px-1 py-[1px] text-xs text-white bg-red-500">connection error</div>
      <div className="mt-3 whitespace-pre-wrap">{errors}</div>
    </div>
  );
}
