import { createRef, useEffect, useState } from 'react';
import {
  type ThebeNotebook,
  type ThebeSession,
  type IThebeCell,
  type IThebeCellExecuteReturn,
  ThebePassiveManager,
  WIDGET_VIEW_MIMETYPE,
  WIDGET_STATE_MIMETYPE,
} from 'thebe-core';
import { useThebeConfig } from '../ThebeServerProvider';
import { useThebeLoader } from '../ThebeLoaderProvider';
import type { IExecuteResult, INotebookContent } from '@jupyterlab/nbformat';
import { useThebeSession } from '../ThebeSessionProvider';
import { useRenderMimeRegistry } from '../ThebeRenderMimeRegistryProvider';
import type { IManagerState } from '@jupyter-widgets/base-manager';

export interface NotebookExecuteOptions {
  stopOnError?: boolean;
  before?: () => void;
  after?: () => void;
  preprocessor?: (s: string) => string;
}

export type IThebeNotebookError = IThebeCellExecuteReturn & { index: number };

export function findErrors(execReturns: (IThebeCellExecuteReturn | null)[]) {
  return execReturns.reduce<IThebeNotebookError[] | null>(
    (acc, retval: IThebeCellExecuteReturn | null, index) => {
      if (retval?.error) {
        if (acc == null) return [{ ...retval, index }];
        else return [...acc, { ...retval, index }];
      }
      return acc;
    },
    null,
  );
}

export function useNotebookBase() {
  const { session, ready: sessionReady } = useThebeSession();
  const [notebook, setNotebook] = useState<ThebeNotebook | undefined>();
  // TODO move the refs to caller hooks as it does so little to maintain them in here.
  const [refs, setRefs] = useState<((node: HTMLDivElement) => void)[]>([]);
  const [sessionAttached, setSessionAttached] = useState(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [executed, setExecuted] = useState(false);
  const [errors, setErrors] = useState<IThebeNotebookError[] | null>(null);

  /**
   * When the notebook and session is avaiable, attach to session
   */
  useEffect(() => {
    if (!notebook || !session || !sessionReady) return;
    console.debug(`thebe-react: attaching notebook to session`, { notebook, session });
    notebook.attachSession(session);
    setSessionAttached(true);
  }, [notebook, session, sessionReady]);

  const executeAll = (options?: NotebookExecuteOptions) => {
    if (!notebook) throw new Error('executeAll called before notebook available');
    if (!session) throw new Error('executeAll called before session available');
    options?.before?.();
    setExecuting(true);
    return notebook
      .executeAll(options?.stopOnError ?? true, options?.preprocessor)
      .then((execReturns) => {
        options?.after?.();
        const errs = findErrors(execReturns);
        if (errs != null) setErrors(errs);
        setExecuted(true);
        setExecuting(false);
        return execReturns;
      });
  };

  const executeSome = (
    predicate: (cell: IThebeCell) => boolean,
    options?: NotebookExecuteOptions,
  ) => {
    if (!notebook) throw new Error('executeSome called before notebook available');
    if (!session) throw new Error('executeAll called before session available');
    options?.before?.();
    setExecuting(true);
    const filteredCells = notebook.cells.filter(predicate).map((c) => c.id);
    return notebook
      .executeCells(filteredCells, options?.stopOnError ?? true, options?.preprocessor)
      .then((execReturns) => {
        options?.after?.();
        const errs = findErrors(execReturns);
        if (errs != null) setErrors(errs);
        setExecuted(true);
        setExecuting(false);
        return execReturns;
      });
  };

  const clear = () => {
    if (!notebook) throw new Error('clear called before notebook available');
    notebook.clear();
    setExecuted(false);
  };

  return {
    ready: !!notebook && sessionAttached,
    attached: sessionAttached,
    executing,
    executed,
    errors,
    notebook,
    setNotebook,
    refs,
    setRefs,
    executeAll,
    executeSome,
    clear,
    session,
  };
}

/**
 * @param name - provided to the fetcher function
 * @param fetchNotebook - an async function, that given a name, can return a JSON representation of an ipynb file (INotebookContent)
 * @param opts - options.refsForWidgetsOnly=false allows refs to be generated for all notebook cells, rather than onlythose with widget tags
 * @returns
 */
export function useNotebook(
  name: string,
  fetchNotebook: (name: string) => Promise<INotebookContent>,
  opts = { refsForWidgetsOnly: true },
) {
  const { core } = useThebeLoader();
  const { config } = useThebeConfig();
  const rendermime = useRenderMimeRegistry();
  const [loading, setLoading] = useState<boolean>(false);

  if (!rendermime) throw new Error('ThebeSessionProvider requires a RenderMimeRegistryProvider');

  const {
    ready,
    attached,
    executing,
    executed,
    errors,
    notebook,
    setNotebook,
    refs,
    setRefs,
    executeAll,
    executeSome,
    clear,
    session,
  } = useNotebookBase();

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
        return core?.ThebeNotebook.fromIpynb(ipynb, config, rendermime);
      })
      .then((nb: ThebeNotebook) => {
        const cells = opts?.refsForWidgetsOnly ? nb?.widgets ?? [] : nb?.cells ?? [];
        const manager = new ThebePassiveManager();
        if (nb.metadata.widgets && (nb.metadata.widgets as any)[WIDGET_STATE_MIMETYPE]) {
          manager.load_state((nb.metadata.widgets as any)[WIDGET_STATE_MIMETYPE] as IManagerState);
        }
        // set up an array of callback refs to update the DOM elements
        setRefs(
          Array(cells.length)
            .fill(null)
            .map((_, idx) => (node) => {
              console.debug(`new ref[${idx}] - attaching to dom...`, node);
              if (node != null) {
                cells[idx].attachToDOM(node, { appendExisting: false });
                cells[idx].render(cells[idx].initialOutputs);
                // cells[idx].setOutputText('attached to DOM [OUTPUT]');

                console.log('about to hydrate widgets', cells[idx].outputs);
                cells[idx].outputs.forEach((output, i) => {
                  console.log('output', i, output);
                  if (
                    (output.output_type === 'display_data' ||
                      output.output_type === 'execute_result') &&
                    typeof output.data === 'object'
                  ) {
                    console.log('output:confirmed', i, output);
                    const mimeBundles = output.data as IExecuteResult;
                    if (mimeBundles[WIDGET_VIEW_MIMETYPE]) {
                      const model_id = (mimeBundles[WIDGET_VIEW_MIMETYPE] as { model_id: string })
                        .model_id;
                      manager.hydrate(model_id, node); // await or faf?
                    }
                  }
                });
              }
            }),
        );
        setNotebook(nb);
        setLoading(false);
      });
  }, [core, config]);

  return {
    ready,
    loading,
    attached,
    executing,
    executed,
    errors,
    notebook,
    cellRefs: refs,
    cellIds: (opts.refsForWidgetsOnly ? notebook?.widgets ?? [] : notebook?.cells ?? []).map(
      (c) => c.id,
    ),
    executeAll,
    executeSome,
    clear,
    session,
  };
}

/**
 * @param sourceCode - just an array of valid code blocks as single line strings
 * @param opts - options.refsForWidgetsOnly=false allows refs to be generated for all notebook cells, rather than onlythose with widget tags
 * @returns
 */
export function useNotebookFromSource(sourceCode: string[], opts = { refsForWidgetsOnly: true }) {
  const { core } = useThebeLoader();
  const { config } = useThebeConfig();
  const rendermime = useRenderMimeRegistry();
  const [loading, setLoading] = useState(false);
  if (!rendermime) throw new Error('ThebeSessionProvider requires a RenderMimeRegistryProvider');
  const {
    ready,
    attached,
    executing,
    executed,
    errors,
    notebook,
    setNotebook,
    refs,
    setRefs,
    executeAll,
    executeSome,
    clear,
    session,
  } = useNotebookBase();

  useEffect(() => {
    if (!core || !config || loading || notebook) return;
    setLoading(true);
    const nb = core.ThebeNotebook.fromCodeBlocks(
      sourceCode.map((source) => ({ id: core?.shortId(), source })),
      config,
      rendermime,
    );
    const cells = opts?.refsForWidgetsOnly ? nb?.widgets ?? [] : nb?.cells ?? [];
    setRefs(
      Array(cells.length)
        .fill(null)
        .map((_, idx) => (node) => {
          console.debug(`new ref[${idx}] - attaching to dom...`, node);
          if (node != null) cells[idx].attachToDOM(node);
        }),
    );
    setNotebook(nb);
    setLoading(false);
  }, [core, notebook, loading]);

  return {
    ready,
    loading,
    attached,
    executing,
    executed,
    errors,
    notebook,
    cellRefs: refs,
    cellIds: (opts.refsForWidgetsOnly ? notebook?.widgets ?? [] : notebook?.cells ?? []).map(
      (c) => c.id,
    ),
    executeAll,
    executeSome,
    clear,
    session,
  };
}

/**
 * DEPRECATED - migrate to useNotebookFromSource
 */
export function useNotebookfromSourceLegacy(sourceCode: string[]) {
  const { core } = useThebeLoader();
  const { config } = useThebeConfig();
  const rendermime = useRenderMimeRegistry();
  if (!rendermime) throw new Error('ThebeSessionProvider requires a RenderMimeRegistryProvider');

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
        rendermime,
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
