const func = require("@jupyterlab/testutils/lib/jest-config");
module.exports = {
  ...func(__dirname),
  testRegex: ["/test/.*.spec.js[x]?$"],
  transformIgnorePatterns: ["node_modules/(?!(@jupyterlab|@jupyter-widgets)/)"],
  setupFiles: ["@jupyterlab/testutils/lib/jest-shim.js", "./jest.setup.js"],
};
