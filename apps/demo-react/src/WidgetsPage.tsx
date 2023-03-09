import { useNotebook } from 'thebe-react';
import JupyterOutputDecoration from './JupyterOutputDecoration';

export function WidgetsPage() {
  // const NAME = 'concepts_Fourier_transform_1D_v02'; // 'widget-test-3';
  const NAME = 'widget-test-3';
  const { ready, loading, attached, executing, notebook, executeAll, cellRefs, cellIds, clear } =
    useNotebook(
      NAME,
      async (n) => {
        const url = `/${n}.ipynb`;
        const resp = await fetch(url);
        if (!resp.ok) throw Error(`Could not load ${url}`);
        return resp.json();
      },
      { refsForWidgetsOnly: false },
    );

  const clickExecute = () => {
    console.log('exec');
    executeAll();
  };

  console.log({ rendermime: notebook?.rendermime });

  return (
    <div className="mt-4">
      <h2>
        A notebook to test <code>ipywidgets</code>
      </h2>
      <h4 className="text-sm">
        notebook: <code>{NAME}.ipynb</code>
      </h4>
      <div className="mt-3 inline-block bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full">
        {ready ? 'ready' : 'not ready'}
      </div>
      <div className="mt-4">
        {!executing && (
          <button className="button" onClick={clickExecute}>
            run all
          </button>
        )}
        {executing && 'EXECUTING...'}
      </div>
      <div className="m-auto max-w-3xl">
        {cellRefs.map((ref, idx) => {
          return (
            <JupyterOutputDecoration key={cellIds[idx]}>
              <div ref={ref}>[output]</div>
            </JupyterOutputDecoration>
          );
        })}
      </div>
    </div>
  );
}
