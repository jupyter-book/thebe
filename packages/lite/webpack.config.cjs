/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { DefinePlugin, NormalModuleReplacementPlugin } = require('webpack');

const shimJS = path.resolve(__dirname, 'src', 'empty.js');
function shim(regExp) {
  return new NormalModuleReplacementPlugin(regExp, shimJS);
}

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
    // shim(/\.(svg|ttf|eot|woff2|woff)/),
    new DefinePlugin({ 'process.env': {} }),
  ],
  output: {
    filename: 'thebe-lite.min.js',
    path: path.resolve(__dirname, 'dist', 'lib'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /pypi\/.*/,
        type: 'asset/source',
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source',
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
