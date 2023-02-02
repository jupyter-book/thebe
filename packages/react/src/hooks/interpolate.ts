/**
 * Very basic interpolation
 *
 * Only parses inline `#| @param` comment tags, python like comments only
 * Always assumes variable assignment
 *
 */

export const PYTHON_PARAM = /^(.*)=([^;]*);*\s*#\|*\s*@param\s*(.*)$/;

/**
 *
 * @param parameterMap - dictionary of known variables and values to inerpolate them to
 * @returns (function) performs interpolation on the source string using the parameterMap
 */
export function interpolatorFactoryFn(parameterMap: Record<string, string>) {
  return (source: string) => {
    const params = new Set(Object.keys(parameterMap));
    const lines = source.split('\n');
    const interpolated = lines.map((line) => {
      if (PYTHON_PARAM.test(line)) {
        const match = line.match(PYTHON_PARAM);
        if (match != null) {
          const [_, variable, value, schemaString] = match;
          let schema = {};
          try {
            if (schemaString !== '') schema = JSON.parse(schemaString);
          } catch (err: any) {
            console.error('Could not parse schema from', line, err);
          }
          if (params.has(variable.trim())) {
            return `${variable}= ${parameterMap[variable.trim()]} #| @param${
              schema ? ` ${JSON.stringify({ ...schema, last: value })}` : ''
            }`;
          }
        }
      }
      return line;
    });
    return interpolated.join('\n');
  };
}
