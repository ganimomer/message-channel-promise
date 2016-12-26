'use strict'
const webpackConfig = require('./webpack.config.js')
webpackConfig.entry = {}

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {pattern: 'src/**/*.js', included: false},
      {pattern: 'test/**/*', included: false},
      'test/**/*.spec.js'
    ],
    preprocessors: {
      'test/**/*.spec.js': ['webpack']
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
