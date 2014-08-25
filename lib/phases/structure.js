"use strict";

var path = require('path');
var needs = require('needs');
var debug = require('debug')('yetta:structure');

module.exports = function (dir, opts) {
    if (typeof dir === 'object') {
        opts = dir;
        dir = null;
    }
    opts = opts || {};

    dir = dir || opts.dir;
    var prop = opts.prop || opts.property || path.basename(dir);

    return function () {
        var self = this;
        if (!self.structure) self.structure = {};
        var fullpath = path.resolve(dir);

        debug('loading modules from', fullpath);
        self.structure[prop] = needs(fullpath, opts);
    };
};