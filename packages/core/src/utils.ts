import { customAlphabet } from 'nanoid';
import { WIDGET_VIEW_MIMETYPE } from './manager';
import type * as nbformat from '@jupyterlab/nbformat';

const nanoid = customAlphabet('1234567890abcdef', 8);

/**
 * Creates a compact random id for use in runtime objects
 *
 * @returns string
 */
export function shortId() {
  return nanoid();
}

export function ensureString(maybeString: string[] | string): string {
  if (Array.isArray(maybeString)) return maybeString.join('\n');
  return maybeString;
}

export function isMimeBundle({ output_type }: nbformat.IOutput) {
  return output_type === 'display_data' || output_type === 'execute_result';
}

export function placeholder(plainText?: string) {
  return `
<div class="thebe-ipywidgets-placeholder">
  <div class="thebe-ipywidgets-placeholder-image"></div>
  <div class="thebe-ipywidgets-placeholder-message"><code>ipywidgets</code> - a Jupyter kernel connection is required to fully display this output.</div>
  ${plainText && `<pre>${plainText}</pre>`}
</div>
`;
}

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

export function stripWidgets(
  outputs: nbformat.IOutput[],
  hideWidgets = true,
  placeholderFn: (plainText?: string) => string = placeholder,
) {
  return outputs.map((output: nbformat.IOutput) => {
    if (!isMimeBundle(output)) return output;
    const { [WIDGET_VIEW_MIMETYPE]: widgets, ...others } = output.data as nbformat.IMimeBundle;
    if (!widgets) return output;

    let data = output.data;
    if (hideWidgets) data = { ...others };

    if (placeholderFn && !('text/html' in (data as nbformat.IMimeBundle)))
      // if there is not already an html bundle, add a placeholder to hide the plain/text field
      (data as nbformat.IMimeBundle)['text/html'] = placeholderFn(
        ensureString((data as nbformat.IMimeBundle)['text/plain'] as string | string[]),
      );

    const stripped = {
      ...output,
      data,
    };
    return stripped;
  });
}
