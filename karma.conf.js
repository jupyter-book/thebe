module.exports = function (config) {
  config.set({
    files: ["test/**/*.js"],
    frameworks: ["mocha"],

    preprocessors: {
      // only specify one entry point
      // and require all tests in there
      "test/test.js": ["webpack"],
    },
    reporters: ["progress", "spec", "coverage-istanbul"],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_DEBUG,
    webpack: require("./webpack.config"),
    webpackMiddleware: { noInfo: true },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary"],
    },

    browsers: ["ChromeHeadless"],
  });
};
