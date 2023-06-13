import { useEffect, useState } from 'react';
import type { PassiveCellRenderer } from 'thebe-core';
import type { IThebeNotebookError } from 'thebe-react';
import { useThebeLoader } from 'thebe-react';
import JupyterOutputDecoration from './JupyterOutputDecoration';

function ErrorTrayMessage({ errors }: { errors: IThebeNotebookError[] }) {
  const { core } = useThebeLoader();

  const [cells, setCells] = useState<PassiveCellRenderer[]>([]);
  const [refs, setRefs] = useState<((node: HTMLDivElement) => void)[]>([]);

  useEffect(() => {
    if (!core) return;
    const cs = errors.map(() => new core.PassiveCellRenderer(core.shortId()));
    setRefs(
      errors.map((_, idx) => (node: any) => {
        if (node) {
          cs[idx].attachToDOM(node);
          cs[idx].render(errors[idx].error ?? []);
        }
      }),
    );
    setCells(cells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [core, errors]);

  if (!core) return null;
  return (
    <div>
      {errors.map((error, idx) => (
        <div className="min-w-[400px]">
          <JupyterOutputDecoration idx={error.index}>
            <div className="z-100" key={error.id} ref={refs[idx]}></div>
          </JupyterOutputDecoration>
        </div>
      ))}
    </div>
  );
}

export function ErrorTray({ errors }: { errors: IThebeNotebookError[] }) {
  return (
    <div className="mt-8 text-sm border border-red-400 text-red-600 px-4 pt-3 rounded relative border-1">
      <div>
        <span className="font-bold">Error</span> - a page refresh may resolve this. If not, shutdown
        this simulation and start another. If the error persists please contact support with a
        screenshot of this page, including the error message below.
      </div>
      <ErrorTrayMessage errors={errors} />
    </div>
  );
}
