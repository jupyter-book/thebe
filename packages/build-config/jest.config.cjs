const path = require('path');
const func = require('@jupyterlab/testutils/lib/jest-config');

module.exports = function (dirname, tsconfig) {
  return {
    ...func(dirname),
    roots: ['<rootDir>'],
    preset: 'ts-jest/presets/default-esm', // or other ESM presets
    testRegex: ['tests/.*.spec.ts'],
    moduleNameMapper: {
      '\\.(gif|ttf|eot|svg|css)$': '@jupyterlab/testutils/lib/jest-file-mock.js',
    },
    transform: {
      '^.+\\.svg$': '../build-config/jest.svg.transform.js',
      '^.+\\.(js|ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@jupyterlab|@jupyter-widgets|y-protocols|lib0|@jupyterlite|nanoid|@jupyter-widgets|d3-format|d3-color|p-props|p-map|aggregate-error|indent-string|clean-stack|escape-string-regexp)/)',
    ],
    globals: {
      'ts-jest': {
        tsconfig: path.join(dirname, tsconfig),
      },
    },
    verbose: true,
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/dist/'],
    setupFiles: ['../build-config/jest.setup.js'],
    setupFilesAfterEnv: ['@jupyterlab/testutils/lib/jest-shim.js'],
  };
};
