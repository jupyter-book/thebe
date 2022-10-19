import React, { useEffect, useState } from 'react';
import {
  makeConfiguration,
  ThebeServer,
  SessionIModel,
  KernelISpecModels,
  KernelISpecModel,
  ThebeSession,
  NotebookStatus,
  ThebeCell,
} from 'thebe-core';
import './App.css';
import { examples, useCellExample, useNotebookExample, WIDGETS_MULTICELL_EXAMPLE } from './example';
import { OutputAreaByRef } from './OutputAreaByRef';
import { SessionListing } from './SessionListing';
import { SessionModelListing } from './SessionModelListing';

const config = makeConfiguration({});

function App() {
  const [server, setServer] = useState<ThebeServer | undefined>();
  const [kernelSpecs, setKernelSpecs] = useState<KernelISpecModels>();
  const [sessionModel, setSessionModels] = useState<SessionIModel[]>([]);
  const [sessions, setSessions] = useState<ThebeSession[]>([]);

  const [kernelName, setKernelName] = useState<string>('thebe-demo');
  const [sessionPath, setSessionPath] = useState<string>('unique-path');

  const simple = useCellExample('simple', 'print("Hello Thebe!!!")');
  const mplexample = useCellExample('mpl', examples['matplotlib']);
  const widgets = useCellExample('widgets', examples['basic_widgets']);
  const ipympl = useCellExample('ipympl', examples['ipympl']);
  const leaflet = useCellExample('leaflet', examples['ipyleaflet']);
  const notebookExample = useNotebookExample(WIDGETS_MULTICELL_EXAMPLE);

  useEffect(() => {});

  const requestServer = () => {
    const newServer = new ThebeServer(config);
    setServer(newServer);
    newServer.connectToJupyterServer();
  };

  const listKernels = () => {
    server?.getKernelSpecs().then(setKernelSpecs);
  };

  const listSessions = () => {
    server?.listRunningSessions().then(setSessionModels);
  };

  const refreshRunningSessions = () => {
    server?.refreshRunningSessions().then(setSessionModels);
  };

  const shutdownSession = (model: SessionIModel) => {
    server?.shutdownSession(model.id).then(listSessions);
  };

  const disposeServer = () => {
    server?.dispose();
    listSessions();
  };

  const connectToSession = (model: SessionIModel) => {
    server
      ?.connectTo(model)
      .then((session: ThebeSession) => setSessions([...sessions, session]))
      .then(listSessions);
  };

  const startNewSession = () => {
    server
      ?.startNewSession({ name: sessionPath, path: sessionPath, kernelName })
      .then((session: ThebeSession | null) => {
        if (session != null) setSessions([...sessions, session]);
      })
      .then(listSessions);
  };

  const clickAttach = (session: ThebeSession) => {
    if (session.kernel == null) return;
    simple.attach(session);
    mplexample.attach(session);
    widgets.attach(session);
    ipympl.attach(session);
    leaflet.attach(session);
    notebookExample.attach(session);

    simple.reRender();
  };

  console.log({ simple, widgets });

  return (
    <div className="p-4">
      <header className="text-5xl pb-1 mb-1 border-gray-500 border-b-2">Thebe React Demo</header>
      <main>
        <div>
          <h1>Connect</h1>
          <p>
            The following demo is setup as an exploration of the capabilities of{' '}
            <code>thebe-core</code> using the API exposed by the runtime objects it provides
          </p>
          <h2>Step 1 - Request a server connection</h2>
          <p>Start a local server as follows:</p>
          <pre>jupyter lab --NotebookApp.token=test-secret --NotebookApp.allow_origin='*'</pre>
          <p>then connect👇</p>
          <button onClick={requestServer}>Connect to a Local Server</button>
        </div>
        {server && (
          <div>
            <div className="section">
              <h2>Step 2 - Which kernels are available</h2>
              <p>Ok, we have a connection to the server! 🤖</p>
              <p>
                The connection is represented by a <code>ThebeServer</code> runtime object.
              </p>
              <p>
                That object has an <code>id: {server.id}</code> which is just for convenience,
                Jupyter knows nothing of this id.
              </p>
              <p>
                Now that we have a connection we could start a kernel on the server by requestig a
                session. But how do we know which kernels are installed and available?
              </p>
              <p>
                We can query the <code>KernelSpecs</code> API and get that information. That will
                gives us the names of the kernels that we need to start a session correctly.
              </p>
              <button onClick={listKernels}>List Available Kernels</button>
              {kernelSpecs && (
                <div>
                  <p>Default kernel is named: {kernelSpecs.default}</p>
                  <div>
                    <div>
                      {Object.values(kernelSpecs.kernelspecs)
                        .filter(
                          (spec: KernelISpecModel | undefined): spec is KernelISpecModel => !!spec,
                        )
                        .map((spec: KernelISpecModel) => (
                          <div className="m-1" key={spec.name}>
                            <code>
                              👾 name: {spec.name} (language: {spec.language})
                            </code>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="section">
              <h2>Step 3 - Looking at server state</h2>
              <p>
                We now know which kernels are available on the server, and which one will be used by
                default.
              </p>
              <p>
                But is there anything already running on the server? is there an existing session
                and which kernel is it using?
              </p>
              <p>
                Note: A "Session" is a JupyterLab concept where a Kernel is a associated with a
                Notebook.
              </p>
              <button onClick={listSessions}>List Running Sessions</button>
              <div className="">
                <SessionModelListing
                  list={sessionModel}
                  onShutdown={shutdownSession}
                  onConnectTo={connectToSession}
                />
                <p>
                  The <code>ThebeServer</code> can be used to{' '}
                  <button onClick={refreshRunningSessions}>refresh</button> info on running
                  sessions, press that button to see if it makes a difference to the listing above.
                </p>
                <p>
                  Note: keep an eye on the <code>#c</code> column in the server sessions table
                  above-above, if you already have kernels listed, maybe because you have stuff open
                  in JupyterLab, you may already have connections to those sessions. Connecting to
                  and starting new sessions here doesn't seem to impact the <code>#c</code> as
                  expected, although sometimes that value will change it seems to be sporadic.
                  Sometimes starting a new session will make this column update across existing
                  sessions.
                </p>
              </div>
              <p>
                We can list the sessions and interact with then as long as the{' '}
                <code>ThebeServer</code> object remains alive and we do not call{' '}
                <button onClick={disposeServer}>Dispose</button> on it, if we do dispose it, we will
                no longer be able to get a list of running sessions and we'll have the reconnect. (
                <code>ThebeServer.isDisposed==={server?.isDisposed ? 'true' : 'false'}</code>)
              </p>
              <p>
                Whether you have sessions listed here or not depends on your server, and whether
                you've just started it or have been using it for a while either directly or from
                here.
              </p>
              <p>
                For the next step we'll need a running session, so either connect to an existing
                session above or start a new one. Or play around, start, stop and connect to some
                sessions to see what happens.
              </p>
              <div>
                <div>
                  path:{' '}
                  <input
                    type="text"
                    onChange={(e) => setSessionPath(e.target.value)}
                    value={sessionPath}
                  />
                </div>
                <div>
                  kernel name:{' '}
                  <input
                    type="text"
                    onChange={(e) => setKernelName(e.target.value)}
                    value={kernelName}
                  />
                </div>

                <button onClick={startNewSession}>Start a New Session</button>
                <p>
                  Once a session is started on a given path, starting new sessions using the same
                  path will just reconnect to the same session.
                </p>
              </div>
            </div>
            <div className="section">
              <h2>Step 4 - Client side session connections</h2>
              <p>
                A <code>ThebeSession</code> is a client side object that wraps a connection to the
                server session, it's up to the client app to keep track of these.
              </p>
              <p>
                The <code>id</code> of the session here is actually the <code>id</code> of the
                connection, so unless you connect to a different session on the server, or start a
                new session with a unique name, you'll establish a connection to the same server
                session. If it's the intent of the client to have only a single connection open to a
                server session at any time, it will have to manage that.
              </p>
              <SessionListing sessions={sessions} onAttach={clickAttach} />
            </div>
            <div className="section">
              <h2>Step 5 - examples using ThebeCell</h2>
              <p>
                Once attached, cells can be executed. The folowing examples all use the ThebeCell
                interface to independently render different examples.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3>Hello Thebe!</h3>
                  <textarea
                    onChange={(e) => simple.setSourceCode(e.target.value)}
                    value={simple.sourceCode}
                  >
                    print("Hello Thebe!")
                  </textarea>
                  <p>Attached to session: {simple.cell?.session?.id}</p>
                  <button onClick={simple.execute}>execute</button>
                  <OutputAreaByRef ref={simple.ref} busy={simple.busy} />
                </div>
                <div>
                  <h3>Plotting with matplotlib</h3>
                  <p>Display a plot</p>
                  <textarea
                    onChange={(e) => mplexample.setSourceCode(e.target.value)}
                    value={mplexample.sourceCode}
                    cols={80}
                    rows={12}
                  ></textarea>
                  <p>Attached to session: {mplexample.cell?.session?.id}</p>
                  <button onClick={mplexample.execute}>execute</button>
                  <OutputAreaByRef ref={mplexample.ref} busy={mplexample.busy} />
                </div>
                <div>
                  <h3>Basic Widgets</h3>
                  <p>
                    Basic widgets are controls, UI elements and containers that are bundles in the
                    main ipywidgets packages, using these widgets should not require any additional
                    libraries to be loaded at runtime.
                  </p>
                  <p>Attached to session: {widgets.cell?.session?.id}</p>
                  <textarea
                    onChange={(e) => widgets.setSourceCode(e.target.value)}
                    value={widgets.sourceCode}
                    cols={80}
                    rows={12}
                  ></textarea>
                  <div>
                    <button onClick={widgets.execute}>execute</button>
                  </div>
                  <OutputAreaByRef ref={widgets.ref} busy={widgets.busy} />
                </div>
                <div>
                  <h3>IPYMPL</h3>
                  <p>
                    For example ipyleaflet or ipympl are custom widgets, that require additional
                    code to be loaded at runtime.
                  </p>
                  <p>Attached to session: {ipympl.cell?.session?.id}</p>
                  <textarea
                    onChange={(e) => ipympl.setSourceCode(e.target.value)}
                    value={ipympl.sourceCode}
                    cols={80}
                    rows={12}
                  ></textarea>
                  <div>
                    <button onClick={ipympl.execute}>execute</button>
                  </div>
                  <OutputAreaByRef ref={ipympl.ref} busy={ipympl.busy} />
                </div>
              </div>
              <div>
                <h3>IPYLEAFLET</h3>
                <p>
                  ipyleaflet is a custom widget, that require additional code to be loaded at
                  runtime.
                </p>
                <p>Attached to session: {leaflet.cell?.session?.id}</p>
                <textarea
                  onChange={(e) => leaflet.setSourceCode(e.target.value)}
                  value={leaflet.sourceCode}
                  cols={80}
                  rows={12}
                ></textarea>
                <div>
                  <button onClick={leaflet.execute}>execute</button>
                </div>
                <OutputAreaByRef ref={leaflet.ref} busy={leaflet.busy} />
              </div>
            </div>
            <div className="section">
              <h2>An Example using the ThebeNotebook interface</h2>
              <p>
                In the following example, the visible code cells here are all contained and executed
                within a single notebook. That notebook holds the ThebeCells which are then attached
                to the DOM. We have compete control over where any cell outputs are rendered. We are
                using this example to show that <code>ipywidgets</code> displayed in multiple cells
                still work in a linked way and update all widgets whether or not they are in the
                same cell.
              </p>
              <p>Attached to session: {ipympl.cell?.session?.id}</p>
              <div>
                <button onClick={notebookExample.execute}>execute all</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  {notebookExample &&
                    notebookExample.notebook?.cells.map((cell: ThebeCell) => (
                      <div key={cell.id}>
                        <textarea
                          className="w-full"
                          onChange={(e) => (cell.source = e.target.value)}
                          value={cell.source}
                          rows={(cell.source.match(/\n/g) || []).length + 1}
                        ></textarea>
                      </div>
                    ))}
                </div>
                <div>
                  {notebookExample &&
                    notebookExample.cellRefs.map((ref, idx) => (
                      <div key={`${notebookExample.notebook?.cells[idx].id}-output`}>
                        <OutputAreaByRef
                          ref={ref}
                          busy={notebookExample.busy}
                          content={`[Output Area for Cell #${idx}]`}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
