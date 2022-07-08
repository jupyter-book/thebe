const func = require('@jupyterlab/testutils/lib/jest-config');
module.exports = {
  ...func(__dirname),
  testRegex: ['/test/.*.spec.js[x]?$'],
  transformIgnorePatterns: ['node_modules/(?!(@jupyterlab|@jupyter-widgets|y-protocols|lib0)/)'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  setupFiles: ['@jupyterlab/testutils/lib/jest-shim.js', './jest.setup.js'],
};
