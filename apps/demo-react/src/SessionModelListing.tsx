import { SessionIModel } from 'thebe-core';

export function SessionModelListing({
  list,
  onShutdown,
  onConnectTo,
}: {
  list: SessionIModel[];
  onShutdown: (model: SessionIModel) => void;
  onConnectTo: (model: SessionIModel) => void;
}) {
  return (
    <div>
      <h3>Sessions running on server</h3>
      <table className="text-center text-sm border table-auto border-separate">
        <thead>
          <tr className="bg-slate-100">
            <td className="text-center" colSpan={3}>
              session
            </td>
            <td className="text-center" colSpan={6}>
              kernel
            </td>
            <td className="text-center" colSpan={3}>
              actions
            </td>
          </tr>
          <tr>
            <td>id</td>
            <td>name</td>
            <td>path</td>
            <td>type</td>
            <td>#c</td>
            <td>name</td>
            <td>state</td>
            <td>last</td>
            <td>reason</td>
            <td>traceback</td>
            <td>shudown</td>
            <td>connectTo</td>
          </tr>
        </thead>
        <tbody>
          {list.map((item: SessionIModel) => (
            <tr className="odd:bg-slate-100" key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.path}</td>
              <td>{item.type}</td>
              <td title={item.kernel?.id}>{item.kernel?.connections}</td>
              <td>{item.kernel?.name}</td>
              <td>{item.kernel?.execution_state}</td>
              <td>{item.kernel?.last_activity}</td>
              <td>{item.kernel?.reason}</td>
              <td>{item.kernel?.traceback}</td>
              <td>
                <button onClick={() => onShutdown(item)}>shutdown</button>
              </td>
              <td>
                <button onClick={() => onConnectTo(item)}>connect</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
