const func = require('@jupyterlab/testutils/lib/jest-config');
module.exports = {
  ...func(__dirname),
  testRegex: ['/test/.*.spec.ts[x]?$'],
  transformIgnorePatterns: [
    'node_modules/(?!(@jupyterlab|@jupyter-widgets|y-protocols|lib0|@jupyterlite|@jupyter-widgets|d3-format|d3-color|p-props|p-map|aggregate-error|indent-string|clean-stack|escape-string-regexp)/)',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['@jupyterlab/testutils/lib/jest-shim.js', './jest.setup.after.js'],
};
