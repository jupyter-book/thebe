import { useEffect, useRef, useState } from 'react';
import { ThebeCell, ThebeSession } from 'thebe-core';

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

export const examples = {
  matplotlib: MATPLOTLIB_EXAMPLE,
  basic_widgets: BASIC_WIDGETS_EXAMPLE,
  ipympl: IPYMPL_EXAMPLE,
  ipyleaflet: IPYLEAFLET_EXAMPLE,
};

export function useExample(name: string, code: string) {
  const [sourceCode, setSourceCode] = useState<string>(code);
  const [busy, setBusy] = useState<boolean>(false);
  const [cell, setCell] = useState<ThebeCell | undefined>();
  const [rr, setReRender] = useState({});
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
