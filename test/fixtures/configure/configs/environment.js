"use strict";

module.exports = function (h) {
    var settings = this.settings;
    h.loadConfigs(__dirname, function (name, config) {
        settings[name] = config;
    });
};