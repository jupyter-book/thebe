const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {},
  devServer: {
    port: 3003,
    compress: true,
    static: ['dist/lib'],
  },
});
