import { useMemo, useState } from 'react';
import { ThebeBundleLoaderProvider, ThebeServerProvider } from 'thebe-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import { Connect } from './Connect';
import { ServerMode, ServerModeType } from './ServerMode';
import { ConnectionStatusTray } from './ConnectionStatusTray';
import { ConnectionErrorTray } from './ConnectionErrorTray';
import { NotebookStatusTray } from './NotebookStatusTray';
import { NotebookErrorTray } from './NotebookErrorTray';

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
    }),
    [path, mode],
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
          <Connect />
          <ConnectionStatusTray />
          <ConnectionErrorTray />
          <NotebookStatusTray />
          <NotebookErrorTray />
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
