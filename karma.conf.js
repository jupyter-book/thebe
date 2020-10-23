module.exports = function (config) {
  config.set({
    files: ["test/test_entrypoint.js", { pattern: "test/fixtures/**/*" }],
    frameworks: ["mocha", "fixture"],
    preprocessors: {
      // only specify one entry point
      // and require all tests in there
      "test/test_entrypoint.js": ["webpack"],
      "**/*.html": ["html2js"],
      "**/*.json": ["json_fixtures"],
    },
    reporters: ["mocha", "coverage-istanbul"],
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_DEBUG,
    webpack: require("./webpack.config"),
    webpackMiddleware: { noInfo: true },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary"],
    },

    browsers: ["ChromeHeadless"],
    jsonFixturesPreprocessor: {
      variableName: "__json__",
    },
  });
};
