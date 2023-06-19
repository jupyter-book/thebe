import liteIcon from './lite.png';
import serverIcon from './server.svg';

export type ServerModeType = 'local' | 'lite' | 'binder';

export function ServerMode({
  mode,
  setMode,
}: {
  mode: ServerModeType;
  setMode: (more: ServerModeType) => void;
}) {
  return (
    <div className="flex justify-center mb-6">
      <fieldset>
        <legend>Choose connection type:</legend>
        <div className="my-2 flex space-x-3">
          <div className="flex flex-row cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              id="local"
              name="server"
              value="local"
              checked={mode === 'local'}
              onChange={() => setMode('local')}
            />
            <label htmlFor="local" className="ml-2 cursor-pointer">
              <img
                className={`w-[40px] inline ${mode === 'local' ? 'animate-pulse' : ''}`}
                src={serverIcon}
                alt="Local Server"
              />{' '}
              Local
            </label>
          </div>
          <div className="flex flex-row cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              id="lite"
              name="server"
              value="lite"
              checked={mode === 'lite'}
              onChange={() => setMode('lite')}
            />
            <label htmlFor="lite" className="ml-2 cursor-pointer">
              <img
                className={`w-[40px] inline ${mode === 'lite' ? 'animate-pulse' : ''}`}
                src={liteIcon}
                alt="Jupyter Lite"
              />{' '}
              Lite
            </label>
          </div>
          <div className="flex flex-row cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              id="binder"
              name="server"
              value="binder"
              checked={mode === 'binder'}
              onChange={() => setMode('binder')}
            />
            <label htmlFor="binder" className="ml-2 cursor-pointer">
              <img
                className={`w-[40px] inline ${mode === 'local' ? 'animate-pulse' : ''}`}
                src={serverIcon}
                alt="Local Server"
              />{' '}
              Binder
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
