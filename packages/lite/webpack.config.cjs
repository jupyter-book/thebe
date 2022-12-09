/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');

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
    new HookShellScriptPlugin({
      afterEmit: [
        'npm run build:post:shuffle',
        'npm run build:post:service',
        'node bin/stubContentsApi.js',
      ],
    }),
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
