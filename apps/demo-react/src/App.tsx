import { useMemo, useState } from 'react';
import { ThebeBundleLoaderProvider, ThebeServerProvider } from 'thebe-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import { Connect } from './Connect';
import { ServerMode, ServerModeType } from './ServerMode';
import { shortId } from 'thebe-core';

function App() {
  const [mode, setMode] = useState<ServerModeType>('local');
  const location = useLocation();

  const path = location.pathname.endsWith('path-test') ? '/notebooks' : '/';

  const options = useMemo(
    () => ({
      kernelOptions: {
        path,
        kernelName: 'python',
      },
      binderOptions: {
        repo: 'executablebooks/thebe-binder-base',
      },
      serverSettings: {
        token: shortId(),
      },
    }),
    [path],
  );

  return (
    <div className="App">
      <div className="my-6">
        <h1 className="text-3xl font-bold">Notebooks & Widgets</h1>
        <p>Available examples:</p>
        <div className="flex justify-center space-x-2">
          <NavLink
            className={({ isActive }) => (isActive ? 'font-semibold underline' : 'hover:underline')}
            to="/nb/widget-test"
          >
            widget basics
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? 'font-semibold underline' : 'hover:underline')}
            to="/nb/widget-test-ipympl"
          >
            ipympl
          </NavLink>
        </div>
      </div>
      <ThebeBundleLoaderProvider loadThebeLite publicPath="/thebe">
        <ThebeServerProvider
          connect={false}
          options={options}
          useBinder={mode === 'binder'}
          useJupyterLite={mode === 'lite'}
        >
          <ServerMode mode={mode} setMode={setMode} />
          {mode === 'local' && (
            <div className="pb-4 space-y-1">
              <div>start a local jupyter server using:</div>
              <div>
                <code className="p-1 font-mono text-sm bg-gray-200 rounded">
                  jupyter lab --NotebookApp.token={options.serverSettings.token}{' '}
                  --NotebookApp.allow_origin='*' --no-browser
                </code>
              </div>
            </div>
          )}
          <Connect />
          <Outlet />
        </ThebeServerProvider>
      </ThebeBundleLoaderProvider>

      <div className="fixed text-xs top-2 right-1">
        Server icon by Ralf Schmitzer from{' '}
        <a
          href="https://thenounproject.com/browse/icons/term/server/"
          target="_blank"
          title="Server Icons"
          rel="noreferrer"
        >
          Noun Project
        </a>
      </div>
    </div>
  );
}

export default App;
