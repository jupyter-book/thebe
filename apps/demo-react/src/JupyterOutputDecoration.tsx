import jupyterLogo from './jupyter.svg';

export default function JupyterOutputDecoration({
  children,
  idx,
}: React.PropsWithChildren<{ idx?: number }>) {
  return (
    <div className="mx-2 my-8 relative border rounded py-3">
      <div className="absolute -top-3 -left-2 z-10 bg-white flex items-center">
        <img className="w-[20px]" src={jupyterLogo} alt="Jupyter Output" />
        {idx && <div className="ml-1 text-sm text-gray-500">cell #: {idx}</div>}
      </div>
      <div className="mx-3">{children}</div>
    </div>
  );
}
