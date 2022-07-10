const func = require('@jupyterlab/testutils/lib/jest-config');
module.exports = {
  ...func(__dirname),
  roots: ['<rootDir>'],
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  testRegex: ['tests/.*.spec.ts'],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg)$': '@jupyterlab/testutils/lib/jest-file-mock.js',
  },
  transform: {
    '^.+\\.svg$': '<rootDir>/jest.svg.transform.js',
    '^.+\\.(js|ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@jupyterlab/)'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  verbose: true,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/dist/'],
  setupFiles: ['@jupyterlab/testutils/lib/jest-shim.js'],
};
