const path = require("path");
const webpack = require("webpack");
const Visualizer = require("webpack-visualizer-plugin");

const shimJS = path.resolve(__dirname, "src", "emptyshim.js");
function shim(regExp) {
  return new webpack.NormalModuleReplacementPlugin(regExp, shimJS);
}
const pkg = require("./package.json");

module.exports = {
  devtool: "source-map",
  entry: ["./src/index.js"],
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
    // shim out some unused packages
    shim(/elliptic/),
    shim(/bn\.js/),
    shim(/readable\-stream/),
    // shim(/@phosphor\/coreutils\/lib\/random/),
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
    new Visualizer({
      filename: "../webpack.stats.html",
    }),
  ],
  optimization: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  shippedProposals: true,
                  targets: {
                    browsers: ["chrome 60", "firefox 45", "ie 10", "safari 9"],
                  },
                },
              ],
            ],
          },
        },
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
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
