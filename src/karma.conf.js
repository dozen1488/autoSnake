/* eslint-env node */

// Karma configuration
// Generated on Fri Dec 29 2017 11:24:22 GMT+0300 (+03)

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      "tests/**/!(*.jest).js"
    ],
    exclude: [
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "tests/**/!(*.jest).js": ["webpack"]
    },
    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],
    port: 9876,
    colors: true, // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    concurrency: Infinity,
    webpack: {
      resolve: {
        extensions: [".js", ".json", ".jsx", ".png"]
      },
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
              presets: [
                "react", "es2017", "stage-2"
              ]
            }
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader"
              }
            ]
          },
          {
            test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
            loader: "file-loader"
          }
        ]
      }
    },
    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-webpack"
    ]
  });
};
