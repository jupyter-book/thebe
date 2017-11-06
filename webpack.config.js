const path = require("path");
const webpack = require("webpack");
const Visualizer = require("webpack-visualizer-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const shimJS = path.resolve(__dirname, "src", "emptyshim.js");
function shim(regExp) {
  return new webpack.NormalModuleReplacementPlugin(regExp, shimJS);
}
const pkg = require("./package.json");

module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    publicPath: "https://unpkg.com/thebelab@" + pkg.version + "/lib/",
  },
  plugins: [
    // Not using moment
    shim(/moment/),
    // Don't need vim keymap
    shim(/codemirror\/keymap\/vim/),
    shim(/codemirror\/addon\/search/),
    // shim out random to avoid webpack pulling in crypto
    shim(/@phosphor\/coreutils\/lib\/random/),
    // shim out some unused phosphor
    shim(
      /@phosphor\/widgets\/lib\/(commandpalette|box|dock|grid|menu|scroll|split|stacked|tab).*/
    ),
    shim(/@phosphor\/(dragdrop|commands).*/),

    // unused @jupyterlab
    shim(/@jupyterlab\/apputils/),
    // shim(/@jupyterlab\/apputils\/lib\/(clientsession|dialog|mainmenu|instancetracker|sanitizer|toolbar)/),
    // shim(/@jupyterlab\/apputils\/style\/.*/),

    // JupyterLab's codemirror package is also big,
    // but not so trival to shim
    // shim(/@jupyterlab\/codemirror\/lib\/editor/),
    shim(/@jupyterlab\/codeeditor\/lib\/jsoneditor/),
    shim(/@jupyterlab\/coreutils\/lib\/(time|settingregistry|.*menu.*)/),
    shim(/@jupyterlab\/services\/lib\/(session|contents|terminal)\/.*/),
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
    }),
    new Visualizer({
      filename: "../webpack.stats.html",
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: [
            [
              "env",
              {
                targets: {
                  chrome: 60,
                  firefox: 45,
                  ie: 10,
                  safari: 9,
                },
              },
            ],
          ],
        },
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.html$/, loader: "file-loader" },
      // jquery-ui loads some images
      { test: /\.(jpg|png|gif)$/, loader: "file-loader" },
      // required to load font-awesome
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      },
    ],
  },
};
