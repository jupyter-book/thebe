import { createRef, useEffect, useRef, useState } from 'react';
import { shortId, ThebeCell, ThebeNotebook, ThebeSession } from 'thebe-core';

const MATPLOTLIB_EXAMPLE = `
import numpy as np
import matplotlib.pyplot as plt

%matplotlib inline

R = np.random.random((32,32))
plt.imshow(R)
plt.title('A Random Grid of Numbers');
`;

const BASIC_WIDGETS_EXAMPLE = `
from ipywidgets import interact, interactive, fixed, interact_manual
import ipywidgets as widgets

def f(x):
    return x

interact(f, x=10);
`;

const IPYMPL_EXAMPLE = `
%matplotlib ipympl
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots()


x = np.linspace(0, 2*np.pi, 100)
y = np.sin(3*x)
ax.plot(x, y)
`;

const IPYLEAFLET_EXAMPLE = `
from ipyleaflet import Map, basemaps, basemap_to_tiles

m = Map(
    basemap=basemap_to_tiles(basemaps.OpenStreetMap.Mapnik),
    center=(48.204793, 350.121558),
    zoom=3
    )
m
`;

export const WIDGETS_MULTICELL_EXAMPLE = [
  `
%matplotlib widget
import ipywidgets as widgets
import matplotlib.pyplot as plt
import numpy as np
`,
  `
x = np.linspace(0,10)

def sine_func(x, w, amp):
    return amp*np.sin(w*x)
`,
  `
fig, ax = plt.subplots(1,1)

def update(w = 1, amp = 1):
    ax.cla()
    ax.set_ylim(-4, 4)
    ax.plot(x, sine_func(x, w, amp)),

w_omega = widgets.FloatSlider(min=0.0, max=4.0, step=0.25, value=1.0, description="omega");
w_amp = widgets.FloatSlider(min=0.0, max=4.0, step=0.1, value=1.0, description="amplitude");
w_plot = widgets.interactive_output(update, dict(w=w_omega, amp=w_amp))

display(w_omega)
display(w_amp)
display(w_plot)
`,
  `
display(w_omega)
display(w_amp)
`,
];

export const examples = {
  matplotlib: MATPLOTLIB_EXAMPLE,
  basic_widgets: BASIC_WIDGETS_EXAMPLE,
  ipympl: IPYMPL_EXAMPLE,
  ipyleaflet: IPYLEAFLET_EXAMPLE,
};

export function useCellExample(name: string, code: string) {
  const [sourceCode, setSourceCode] = useState<string>(code);
  const [busy, setBusy] = useState<boolean>(false);
  const [cell, setCell] = useState<ThebeCell | undefined>();
  const [_, setReRender] = useState({});
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cell) return;
    setCell(new ThebeCell(name, 'none', sourceCode));
  }, [cell]);

  const execute = () => {
    if (!cell) return;
    cell.source = sourceCode;
    setBusy(true);
    cell?.execute().then(() => {
      setBusy(false);
    });
  };

  const attach = (session: ThebeSession) => {
    if (session.kernel == null) return;
    if (cell?.isAttached) cell.detachSession();
    cell?.attachSession(session);
    if (ref.current) cell?.attachToDOM(ref.current);
    setCell(cell); // trigger a re-render
  };

  return {
    sourceCode,
    setSourceCode,
    busy,
    setBusy,
    cell,
    setCell,
    ref,
    attach,
    execute,
    reRender: () => setReRender({}),
  };
}

export function useNotebookExample(sourceCode: string[]) {
  const [busy, setBusy] = useState<boolean>(false);
  const [notebook, setNotebook] = useState<ThebeNotebook | undefined>();
  const [_, setReRender] = useState({});
  const [cellRefs, setCellRefs] = useState<React.RefObject<HTMLDivElement>[]>(
    Array(sourceCode.length)
      .fill(undefined)
      .map(() => createRef()),
  );

  useEffect(() => {
    if (notebook) return;
    setNotebook(
      ThebeNotebook.fromCodeBlocks(
        sourceCode.map((source) => ({ id: shortId(), source })),
        {},
      ),
    );
  }, [notebook]);

  const execute = () => {
    if (!notebook) return;
    setBusy(true);
    notebook?.executeAll().then(() => {
      setBusy(false);
    });
  };

  const attach = (session: ThebeSession) => {
    if (session.kernel == null) return;
    notebook?.detachSession();
    notebook?.attachSession(session);
    notebook?.cells.forEach((cell: ThebeCell, idx: number) => {
      if (cellRefs[idx].current) cell.attachToDOM(cellRefs[idx].current ?? undefined);
    });
  };

  return {
    notebook,
    busy,
    execute,
    attach,
    cellRefs,
    rerender: () => setReRender({}),
  };
}
