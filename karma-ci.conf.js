// const process = require('process');
// process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => {
  config.set({
    basePath: '',
    browserNoActivityTimeout   : 50000,
    browserDisconnectTolerance : 2,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: true
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['text-summary'],
      fixWebpackSourcePaths: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers  : ['ChromiumHeadless'],
    customLaunchers: {
      ChromiumHeadless: {
        base  : 'Chromium',
        flags : [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]

      }
    },

    singleRun: true
  });
};
