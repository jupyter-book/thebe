import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/idea.css';

import type { Options } from './options';
import type { IThebeCell } from 'thebe-core';
import type { ICompleteReplyMsg } from '@jupyterlab/services/lib/kernel/messages';
import type { CellDOMPlaceholder } from './types';

interface DefaultCodeMirrorConfig {
  theme: 'default';
  mode: 'python';
  readOnly: false;
  autoRefresh: true;
  lineNumbers: true;
  styleActiveLine: true;
  matchBrackets: true;
}

interface PageCodeMirrorConfig {
  mode?: string;
  readOnly?: boolean;
}

interface RequiredCodeMirrorConfig {
  value: string;
  extraKeys: {
    'Shift-Enter': () => void;
    'Ctrl-Space': () => void;
    'Esc': () => void;
  };
}

export function setupCodemirror(
  options: Options,
  item: CellDOMPlaceholder,
  cell: IThebeCell,
  cellEl: HTMLElement,
  editorEl: HTMLElement,
  setBusy: (id: string) => void,
  clearBusy: (id: string) => void,
) {
  const { source: sourceEl } = item.placeholders;
  const modeFromPage = sourceEl.getAttribute('data-language') || 'python';
  const isReadOnlyFromPage = sourceEl.getAttribute('data-readonly');
  console.debug(`thebe:setupCodemirror isReadOnly: ${isReadOnlyFromPage}`);

  async function execute() {
    console.debug(`thebe:codemirror:shift-enter execute`);
    try {
      setBusy(cell.id);
      await cell.execute(cell.source);
      clearBusy(cell.id);
    } catch (error) {
      cell.clearOnError(error);
    }
  }

  const ref: { cm?: any } = { cm: undefined };

  function unFocus() {
    ref.cm?.display.input.blur()
  }

  function codeCompletion() {
    console.debug(`thebe:codemirror:codeCompletion`);
    const code = ref.cm?.getValue();
    const cursor = ref.cm?.getDoc().getCursor();
    if (cell.session?.kernel) {
      cell.session?.kernel
        .requestComplete({
          code,
          cursor_pos: ref.cm?.getDoc().indexFromPos(cursor),
        })
        .then((value: ICompleteReplyMsg) => {
          if (value.content.status === 'ok') {
            const from = ref.cm?.getDoc().posFromIndex(value.content.cursor_start);
            const to = ref.cm?.getDoc().posFromIndex(value.content.cursor_end);
            ref.cm?.showHint({
              container: editorEl,
              hint: () => {
                return {
                  from: from,
                  to: to,
                  list: (value.content as { matches: string[] }).matches,
                };
              },
            });
          }
        });
    }
  }

  const defaultSettings: DefaultCodeMirrorConfig = {
    theme: 'default',
    mode: 'python',
    readOnly: false,
    autoRefresh: true,
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
  };

  const configFromPage: PageCodeMirrorConfig = {
    mode: modeFromPage,
    readOnly: undefined,
  };

  if (isReadOnlyFromPage != null) {
    // override settings using the cell attribute
    configFromPage.readOnly = isReadOnlyFromPage == 'false' ? false : true;
  }

  const requiredSettings: RequiredCodeMirrorConfig = {
    value: cell.source,
    extraKeys: {
      'Shift-Enter': execute,
      'Ctrl-Space': codeCompletion,
      'Esc': unFocus,
  },
  };

  const codeMirrorConfig = Object.assign(
    {},
    defaultSettings,
    options.codeMirrorConfig ?? {},
    configFromPage,
    requiredSettings,
  );
  console.debug('thebe:setupCodemirror:codeMirrorConfig', codeMirrorConfig);

  ref.cm = new CodeMirror(editorEl as HTMLElement, codeMirrorConfig);
  // TODO enable loading of mode js files via configuration
  // see https://github.com/jupyterlab/jupyterlab/blob/3.6.x/packages/codemirror/src/mode.ts for
  // an example of how to do this
  ref.cm.setOption('mode', codeMirrorConfig.mode);

  // All cells in the notebook automatically update their sources on change
  ref.cm.on('change', () => {
    const code = ref.cm.getValue();
    cell.source = code;
    ref.cm.refresh();
  });

  if (codeMirrorConfig.readOnly) {
    ref.cm.display.lineDiv.setAttribute('data-readonly', 'true');
    editorEl.setAttribute('data-readonly', 'true');
    cellEl.setAttribute('data-readonly', 'true');
  }

  ref.cm.refresh();

  return ref.cm;
}
