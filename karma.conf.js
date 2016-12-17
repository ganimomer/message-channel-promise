'use strict'
const webpackConfig = require('./webpack.config.js')
webpackConfig.entry = {}

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'test/**/*'
    ],
    preprocessors: {
      'test/**/*.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  })
}
