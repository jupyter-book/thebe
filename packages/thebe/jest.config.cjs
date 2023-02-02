const makeConfig = require('../build-config/jest.config.cjs');
module.exports = {
  ...makeConfig(__dirname, 'tsconfig.json'),
};
