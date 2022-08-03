const func = require('@jupyterlab/testutils/lib/jest-config');
module.exports = {
  ...func(__dirname),
  testRegex: ['/test/.*.spec.ts[x]?$'],
  transformIgnorePatterns: [
    'node_modules/(?!(@jupyterlab|@jupyter-widgets|y-protocols|lib0|@jupyterlite)/)',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['@jupyterlab/testutils/lib/jest-shim.js', './jest.setup.after.js'],
};
