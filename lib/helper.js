"use strict";

var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    return new Helper(app);
};

function Helper(app) {
    this.app = app;
}

Helper.prototype.loadConfigs = function loadConfigs(dir, callback) {
    var app = this.app;
    fs.readdirSync(dir).forEach(function(file) {
        if (file[0] === '.' || file.match(/^(Roco|environment|routes|autoload)\.(js|coffee|json|yml|yaml)$/)) {
            return;
        }
        var filename = path.join(dir, file);
        var basename = path.basename(filename, path.extname(filename));
        var stats = fs.statSync(filename);
        if (stats.isFile()) {
            var conf = require(filename);
            if ('function' === typeof conf) {
                conf = conf.call(app);
            } else {
                conf = app.env ? conf[app.env] : conf;
            }
            if (conf) {
                if (callback) return callback(basename, conf);
                if (typeof app.set === 'function') return app.set(basename, conf);
            }
        }
    });
};