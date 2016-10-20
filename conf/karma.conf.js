// Karma configuration
// Generated on Fri Dec 11 2015 17:24:07 GMT+0100 (Romance Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'https://cdn.jsdelivr.net/jquery/2.1/jquery.min.js',
      'http://rawgit.com/LearnBoost/expect.js/master/index.js',
      'http://rawgit.com/tmcw/happen/master/happen.js',
      'draggable.js',
      'test/draggable.test.js'
    ],


    // list of files to exclude
    exclude: [
      '!draggable.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'draggable.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],
    
    
    // configure the coverage reporter 
    coverageReporter: {
      // Specify a reporter type.
      type: 'lcov',
      dir: 'coverage/',
      subdir: function(browser) {
        // normalization process to keep a consistent browser name accross different OS
        return browser.toLowerCase().split(/[ /-]/)[0]; // output the results into: './coverage/phantomjs/'
      }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
