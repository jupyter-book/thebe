const path = require('path');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /pypi\/.*/,
    type: 'asset/source',
  });

  config.module.rules.push({
    test: /\.ipynb$/,
    type: 'json',
  });

  config.resolve.alias = {
    '~': path.resolve(__dirname, 'src'),
  };

  return config;
};
