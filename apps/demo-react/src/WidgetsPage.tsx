import { useNotebook } from 'thebe-react';
import JupyterOutputDecoration from './JupyterOutputDecoration';
import { useParams } from 'react-router-dom';

export function WidgetsPage() {
  const { notebookName } = useParams<{ notebookName: string }>();
  const { ready, executing, executeAll, cellRefs, cellIds } = useNotebook(
    notebookName ?? 'widget-test',
    async (n) => {
      const url = `/${n}.ipynb`;
      const resp = await fetch(url);
      if (!resp.ok) throw Error(`Could not load ${url}`);
      return resp.json();
    },
    { refsForWidgetsOnly: true },
  );

  const clickExecute = () => {
    executeAll();
  };

  return (
    <div className="mt-4">
      <h2>
        A notebook to test <code>ipywidgets</code>
      </h2>
      <h4 className="text-sm">
        notebook: <code>{notebookName}.ipynb</code>
      </h4>
      <div className="inline-block px-4 py-2 mt-3 text-sm font-bold text-white bg-green-500 rounded-full">
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
      <div className="max-w-3xl m-auto">
        {/* {errors && <ConnectionErrorTray />} */}
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
