/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const NoEmitPlugin = require('no-emit-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    usedExports: true,
  },
  entry: {
    app: './src/index.ts',
  },
  plugins: [
    new DefinePlugin({ 'process.env': {} }),
    new webpack.ProvidePlugin({
      currentScript: 'current-script-polyfill',
    }),
    new IgnoreEmitPlugin([/^pypi\/.*\.(whl|json)$/]),
  ],
  output: {
    filename: 'thebe-lite.min.js',
    path: path.resolve(__dirname, 'dist', 'lib'),
    publicPath: 'auto',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /pypi\/.*/,
        type: 'asset/resource',
        generator: {
          filename: 'build/pypi/[name][ext][query]',
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
