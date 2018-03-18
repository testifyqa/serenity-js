'use strict';
require('ts-node/register');

exports.config = {
    directConnect: true,
    framework: 'mocha',
    specs: ['cookbook/**/*.recipe.ts'],

    restartBrowserBetweenTests: false,

    capabilities: {
        browserName: 'chrome',

        chromeOptions: {
            args: [ "--headless", "--disable-gpu", "--window-size=800,600" ]
        }
    }
};
