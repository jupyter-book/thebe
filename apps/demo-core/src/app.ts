import { ThebeEvents, ThebeEventType, ThebeSession } from 'thebe-core';
import { shortId, ThebeNotebook, makeConfiguration, ThebeServer } from 'thebe-core';
import { code, options } from './setup';

export type ServerType = 'local' | 'lite' | 'binder';
export type ExampleType = 'basic' | 'ipywidgets' | 'ipyleaflet' | 'tqdm';

class App {
  options: Record<string, any>;
  serverType: ServerType;
  exampleType: ExampleType;

  localMessageEl: HTMLDivElement;
  connectEl: HTMLDivElement;
  typeLocalEl: HTMLInputElement;
  typeLiteEl: HTMLInputElement;
  typeBinderEl: HTMLInputElement;
  exampleBasicEl: HTMLElement;
  exampleIpywidgetsEl: HTMLElement;
  exampleIpyleafletEl: HTMLElement;

  runAllButtonEl: HTMLElement;
  runLastButtonEl: HTMLElement;
  restartButtonEl: HTMLElement;

  serverStatusEl: HTMLElement;
  sessionStatusEl: HTMLElement;
  thebeErrorEl: HTMLElement;

  outputEl: HTMLElement;

  events: ThebeEvents;
  server: ThebeServer | null;
  session: ThebeSession | null;
  notebook: ThebeNotebook | null;

  constructor() {
    this.localMessageEl = document.getElementById('local-message') as HTMLDivElement;
    this.connectEl = document.getElementById('connect') as HTMLDivElement;
    this.typeLocalEl = document.getElementById('local') as HTMLInputElement;
    this.typeLiteEl = document.getElementById('lite') as HTMLInputElement;
    this.typeBinderEl = document.getElementById('binder') as HTMLInputElement;
    this.exampleBasicEl = document.getElementById('basic') as HTMLInputElement;
    this.exampleIpywidgetsEl = document.getElementById('ipywidgets') as HTMLInputElement;
    this.exampleIpyleafletEl = document.getElementById('ipyleaflet') as HTMLInputElement;

    this.runAllButtonEl = document.getElementById('run-all') as HTMLInputElement;
    this.runLastButtonEl = document.getElementById('run-last') as HTMLInputElement;
    this.restartButtonEl = document.getElementById('restart') as HTMLInputElement;

    this.serverStatusEl = document.getElementById('server-status') as HTMLSpanElement;
    this.sessionStatusEl = document.getElementById('session-status') as HTMLSpanElement;
    this.thebeErrorEl = document.getElementById('thebe-error') as HTMLSpanElement;

    this.outputEl = document.querySelector('[data-output]') as HTMLDivElement;

    this.serverType = 'local';
    this.exampleType = 'basic';
    this.options = options.local;

    this.events = new ThebeEvents();
    this.server = null;
    this.session = null;
    this.notebook = null;

    this.setupUI();
  }

  handleServerTypeChange(evt: MouseEvent) {
    console.log('handleServerTypeChange', this);
    if ((evt.target as Element).id === 'local') {
      this._showLocalMessage();
      this.options = options.local;
      this.serverType = 'local';
    } else if ((evt.target as Element).id === 'lite') {
      this._hideLocalMessage();
      this.options = options.lite;
      this.serverType = 'lite';
    } else if ((evt.target as Element).id === 'binder') {
      this._hideLocalMessage();
      this.options = options.binder;
      this.serverType = 'binder';
    }
    this.resetUI();
    this.disconnect();
  }

  handleExampleTypeChange(evt: MouseEvent) {
    if ((evt.target as Element).id === 'basic') {
      this.resetUI();
      this.exampleType = 'basic';
    } else if ((evt.target as Element).id === 'ipywidgets') {
      this.resetUI();
      this.exampleType = 'ipywidgets';
    } else if ((evt.target as Element).id === 'ipyleaflet') {
      this.resetUI();
      this.exampleType = 'ipyleaflet';
    }
    this._writeCode(code[this.exampleType]);
  }

  setupUI() {
    this.connectEl.onclick = () => {
      this.connectEl.setAttribute('disabled', 'true');
      this.connect();
    };

    this.typeLocalEl.onclick = this.handleServerTypeChange.bind(this);
    this.typeLiteEl.onclick = this.handleServerTypeChange.bind(this);
    this.typeBinderEl.onclick = this.handleServerTypeChange.bind(this);

    this.exampleBasicEl.onclick = this.handleExampleTypeChange.bind(this);
    this.exampleIpywidgetsEl.onclick = this.handleExampleTypeChange.bind(this);
    this.exampleIpyleafletEl.onclick = this.handleExampleTypeChange.bind(this);

    this.runAllButtonEl.onclick = () => this.notebook?.executeAll();
    this.runLastButtonEl.onclick = () => this.notebook?.executeOnly(this.notebook.lastCell().id);
    this.restartButtonEl.onclick = () => this.session?.restart();

    this.events.on(ThebeEventType.status, (evt, data) => {
      const { subject, status } = data;
      if (subject === 'server') this.serverStatusEl.innerText = status as string;
      if (subject === 'session') this.sessionStatusEl.innerText = status as string;
    });

    this.events.on(ThebeEventType.error, (evt, data) => {
      const { subject, message } = data;
      console.error(evt, data);
      this.thebeErrorEl.innerText = `${[subject]}: ${message}`;
    });

    this._writeCode(code[this.exampleType]);
  }

  _showLocalMessage() {
    this.localMessageEl.style.visibility = 'visible';
    this.localMessageEl.style.height = 'auto';
  }

  _hideLocalMessage() {
    this.localMessageEl.style.visibility = 'hidden';
    this.localMessageEl.style.height = '0px';
  }

  _enableCellControls() {
    this.runAllButtonEl.removeAttribute('disabled');
    this.runLastButtonEl.removeAttribute('disabled');
    this.restartButtonEl.removeAttribute('disabled');
  }

  _disableCellControls() {
    this.runAllButtonEl.setAttribute('disabled', 'true');
    this.runLastButtonEl.setAttribute('disabled', 'true');
    this.restartButtonEl.setAttribute('disabled', 'true');
  }

  _writeCode(source: string[]) {
    const codeArea = document.getElementById('code_area');
    if (codeArea) {
      codeArea.innerHTML = '';
      source.forEach((block) => {
        const node = document.createElement('pre');
        node.innerHTML = block.trim();
        codeArea.appendChild(node);
      });
    }
  }

  resetUI() {
    this.connectEl.removeAttribute('disabled');
    document.getElementById('run-all')?.setAttribute('disabled', 'true');
    document.getElementById('run-last')?.setAttribute('disabled', 'true');
    document.getElementById('restart')?.setAttribute('disabled', 'true');

    const dataOutput = document.getElementById('data-output');
    if (dataOutput) dataOutput.innerHTML = '<img src="output.png" />';

    const serverStatus = document.getElementById('server-status');
    if (serverStatus) serverStatus.innerHTML = 'unknown';

    const sessionStatus = document.getElementById('session-status');
    if (sessionStatus) sessionStatus.innerHTML = 'unknown';

    this.thebeErrorEl.innerText = '';
  }

  async connect() {
    this.server = new ThebeServer(makeConfiguration(this.options, this.events));
    if (this.serverType === 'binder') {
      await this.server?.connectToServerViaBinder();
    } else if (this.serverType === 'lite') {
      await this.server?.connectToJupyterLiteServer();
    } else {
      // local
      await this.server?.connectToJupyterServer();
    }

    this.session = await this.server.startNewSession();

    this.notebook = ThebeNotebook.fromCodeBlocks(
      code[this.exampleType].map((source) => ({
        id: shortId(),
        source,
      })),
      this.server.config,
    );

    if (this.session == null) console.error('could not start session');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.notebook.attachSession(this.session!);
    const last = this.notebook.lastCell();
    last.attachToDOM(this.outputEl);

    this._enableCellControls();
  }

  async disconnect() {
    await this.session?.shutdown();
    this.server = null;
    this.session = null;
    this.notebook = null;
    this._disableCellControls();
  }
}

export default App;
