function randomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return 'id-' + uint32.toString(16);
}

const BASIC_CODE = [
  `
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
      `,
  `
# oxa:fs
fs = 1
# oxa:phi
phi = np.pi/5
        `,
  `
plt.ion()
fig, ax = plt.subplots()
x = np.arange(-np.pi/2,np.pi/2,0.01)
y = np.cos(2*np.pi*fs*x+phi)
yy = np.sin(2*np.pi*fs*x+phi)
ax.plot(x,y);
ax.plot(x,yy);
plt.grid(True)
        `,
];

const IPYWIDGETS_CODE = [
  `import piplite
await piplite.install(["ipywidgets", "ipympl"])`,
  `%matplotlib widget
import ipywidgets as widgets
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0,10)

def sine_func(x, w, amp):
  return amp*np.sin(w*x)

@widgets.interact(w=(0, 4, 0.25), amp=(0, 4, .1))
def update(w = 1, amp = 1):
  plt.clf()
  plt.ylim(-4, 4)
  plt.plot(x, sine_func(x, w, amp))`,
];

const IPYLEAFLET_CODE = [
  `from ipyleaflet import Map
from ipywidgets import Layout
# Collect common parameters
zoom = 8
place = None

# Create ipyleaflet tile layer from that server

places = dict(
    orotava=dict(center=(28.389216, -16.520283), zoom=12),
    pico_tiede=dict(center=(28.272401, -16.642457), zoom=12),
    santa_cruz=dict(center=(28.466965, -16.249938), zoom=12)
)

center = places[place]["center"] if place is not None else (28.586850, -15.648742)
zoom = places[place]["zoom"] if place is not None else zoom

# Create ipyleaflet map, add layers, add controls, and display
m = Map(center=center, zoom=zoom, layout=Layout( height='800px'))
m`,
];

const statusCallback = ({ id, subject, status, message }) => {
  if (subject === 'server') {
    const serverStatus = document.getElementById('server-status');
    serverStatus.innerText = status;
  } else if (subject === 'session') {
    const sessionStatus = document.getElementById('session-status');
    sessionStatus.innerText = status;
  }
  console.log(`[${subject}][${status}][${id}]: ${message}`);
};

async function demoBasic(code, options) {
  const codeWithIds = code.map((c) => ({
    id: randomId(),
    source: c,
  }));
  statusCallback;

  // TODO move notebook creation out to where code is selected
  const notebook = thebeCore.api.setupNotebook(codeWithIds, options);
  const last = notebook.lastCell();
  last.attachToDOM(document.querySelector('[data-output]'));

  const loggingCallback = ({ id, subject, status, message }) => {
    console.log(`[${subject}][${status}][${id}]: ${message}`);
  };

  const { server, session } = await thebeCore.api.connect(
    options,
    statusCallback ?? loggingCallback
  );

  await server.ready;
  await session.kernel.ready;

  notebook.attachSession(session);

  const runAllButton = document.getElementById('run-all');
  runAllButton.onclick = (ev) => {
    notebook.executeAll();
  };
  runAllButton.disabled = false;

  const runLastButton = document.getElementById('run-last');
  runLastButton.onclick = (ev) => {
    notebook.executeOnly(notebook.lastCell().id);
  };
  runLastButton.disabled = false;

  const restartButton = document.getElementById('restart');
  restartButton.onclick = (ev) => {
    session.restart();
  };
  restartButton.disabled = false;
}
