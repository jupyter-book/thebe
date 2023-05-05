import { useEffect } from 'react';
import { useThebeCore, useThebeServer } from 'thebe-react';
import liteIcon from './lite.png';
import serverIcon from './server.svg';

export type ServerModeType = 'local' | 'lite';

export function ServerMode({
  mode,
  setMode,
}: {
  mode: ServerModeType;
  setMode: (more: ServerModeType) => void;
}) {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2">
        <div>
          <img
            className={`w-[40px] ${mode === 'local' ? 'animate-pulse' : ''}`}
            src={serverIcon}
            alt="Local Server"
          />
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mode === 'lite'}
              className="sr-only peer"
              onChange={(e) => setMode(e.target.checked ? 'lite' : 'local')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div>
          <img
            className={`w-[40px] ${mode === 'lite' ? 'animate-pulse' : ''}`}
            src={liteIcon}
            alt="Jupyter Lite"
          />
        </div>
      </div>
    </div>
  );
}
