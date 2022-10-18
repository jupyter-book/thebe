import { shortId, ThebeSession } from 'thebe-core';

export function SessionListing({
  sessions,
  onAttach,
}: {
  sessions: ThebeSession[];
  onAttach: (session: ThebeSession) => void;
}) {
  return (
    <div>
      <table className="text-center text-sm border table-auto border-separate">
        <thead>
          <tr className="bg-slate-100">
            <th>id</th>
            <th>name</th>
            <th>path</th>
            <th>kernel name</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session: ThebeSession) => (
            <tr key={`${session.id}-${shortId()}`}>
              <td>{session.id}</td>
              <td>{session.name}</td>
              <td>{session.path}</td>
              <td>{session.kernel?.name}</td>
              <td>
                <button onClick={() => onAttach(session)}>attach</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
