import { createRef, useEffect, useState } from 'react';
import type { ThebeNotebook, ThebeSession, IThebeCell } from 'thebe-core';
import { useThebeConfig } from '../ThebeServerProvider';
import { useThebeCore } from '../ThebeCoreProvider';
import type { INotebookContent } from '@jupyterlab/nbformat';
import { useThebeSession } from '../ThebeSessionProvider';

interface ExecuteOptions {
  before?: () => void;
  after?: () => void;
  preprocessor?: (s: string) => string;
}

export function useNotebook(
  name: string,
  fetchNotebook: (name: string) => Promise<INotebookContent>,
  opts = { refsForWidgetsOnly: true },
) {
  const { core } = useThebeCore();
  const { config } = useThebeConfig();
  const { session } = useThebeSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [notebook, setNotebook] = useState<ThebeNotebook | undefined>();
  const [refs, setRefs] = useState<((node: HTMLDivElement) => void)[]>([]);
  const [sessionAttached, setSessionAttached] = useState(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [executed, setExecuted] = useState(false);
  const [_, setReRender] = useState({});

  /**
   * - set loading flag
   * - load the notebook
   * - setup callback refs, to auto-attach to dom
   * - set notebook, which triggers
   * - clear loading flag
   */
  useEffect(() => {
    if (!core || !config) return;
    setLoading(true);
    fetchNotebook(name)
      .then((ipynb) => {
        return core?.ThebeNotebook.fromIpynb(ipynb, config);
      })
      .then((nb: ThebeNotebook) => {
        const cells = opts?.refsForWidgetsOnly ? nb?.widgets ?? [] : nb?.cells ?? [];
        // set up an array of callback refs to update the DOM elements
        setRefs(
          Array(cells.length)
            .fill(null)
            .map((_, idx) => (node) => {
              console.log(`new ref[${idx}] - attaching to dom...`, node);
              if (node != null) cells[idx].attachToDOM(node);
            }),
        );

        setNotebook(nb);
        setLoading(false);
      });
  }, [core, config]);

  /**
   * When the notebook and session is avaiable, attach to session
   */
  useEffect(() => {
    if (!notebook || !session) return;
    notebook.attachSession(session);
    setSessionAttached(true);
  }, [notebook, session]);

  const executeAll = (options?: ExecuteOptions) => {
    if (!notebook) throw new Error('executeAll called before notebook available');
    options?.before?.();
    setExecuting(true);
    return notebook.executeAll(true, options?.preprocessor).then((exec_return) => {
      options?.after?.();
      setExecuted(true);
      setExecuting(false);
      return exec_return;
    });
  };

  const executeSome = (predicate: (cell: IThebeCell) => boolean, options?: ExecuteOptions) => {
    if (!notebook) throw new Error('executeSome called before notebook available');
    options?.before?.();
    setExecuting(true);
    const filteredCells = notebook.cells.filter(predicate).map((c) => c.id);
    return notebook.executeCells(filteredCells, true, options?.preprocessor).then((exec_return) => {
      options?.after?.();
      setExecuted(true);
      setExecuting(false);
      return exec_return;
    });
  };

  const clear = () => {
    if (!notebook) throw new Error('clear called before notebook available');
    notebook.clear();
    setExecuted(false);
  };

  return {
    ready: !!notebook && sessionAttached,
    loading,
    attached: sessionAttached,
    executing,
    executed,
    notebook,
    cellRefs: refs,
    cellIds: (opts.refsForWidgetsOnly ? notebook?.widgets ?? [] : notebook?.cells ?? []).map(
      (c) => c.id,
    ),
    executeAll,
    executeSome,
    clear,
    rerender: () => setReRender({}),
    session,
  };
}

export function useNotebookfromSource(sourceCode: string[]) {
  const { core } = useThebeCore();
  const { config } = useThebeConfig();

  const [busy, setBusy] = useState<boolean>(false);
  const [notebook, setNotebook] = useState<ThebeNotebook | undefined>();
  const [_, setReRender] = useState({});
  const [cellRefs] = useState<React.RefObject<HTMLDivElement>[]>(
    Array(sourceCode.length)
      .fill(undefined)
      .map(() => createRef()),
  );

  useEffect(() => {
    if (!core || !config || notebook) return;
    setNotebook(
      core.ThebeNotebook.fromCodeBlocks(
        sourceCode.map((source) => ({ id: core?.shortId(), source })),
        config,
      ),
    );
  }, [core, notebook]);

  const execute = () => {
    if (!notebook) throw new Error('execute called before notebook available');
    setBusy(true);
    notebook.executeAll().then(() => {
      setBusy(false);
    });
  };

  const attach = (session: ThebeSession) => {
    if (session.kernel == null) return;
    if (!notebook) {
      console.warn('attach called before notebook available');
      return;
    }
    notebook?.detachSession();
    notebook?.attachSession(session);
    notebook?.cells.forEach((cell: IThebeCell, idx: number) => {
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
