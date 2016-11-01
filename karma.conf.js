module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      "client/assets/javascripts/vendor/bundle.js",
      "client/assets/javascripts/main.js",
      "client/app/components/**/*.html",
      "client/app/components/**/*.spec.js",
      "client/app/filters/*.spec.js"
    ],

    exclude: [
    ],

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-opera-launcher',
      'karma-ie-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
      'client/app/components/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'video-portal'
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
