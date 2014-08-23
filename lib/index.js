"use strict";

var bootable = require('bootable');
var slice = Array.prototype.slice;

function flatten(arr, ret){
    ret = ret || [];
    var len = arr.length;
    for (var i = 0; i < len; ++i) {
        if (Array.isArray(arr[i])) {
            flatten(arr[i], ret);
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
}

/**
 * Make `app` bootable.
 *
 * This function makes an application bootable.  Booting consists of executing
 * a sequence of phases to initialize the application.
 *
 * Examples:
 *
 *     var app = yetta(express());
 *     app.phase(yetta.initializers());
 *
 *     app.boot(function(err) {
 *       if (err) { throw err; }
 *       app.listen(3001);
 *     });
 *
 * @param {Object} app
 * @returns {Object} app the mixin-ed app
 * @property {String} root
 * @property {Function} phase
 * @property {Function} boot
 * @api public
 */
exports = module.exports = function(app, opts) {
    opts = opts || {};
    if (typeof opts === 'string') {
        opts = {root: opts};
    }
    var root = opts.root || process.cwd();
    delete opts.root;

    app.root = root;

    /**
     * Mixin initializer.
     */
    app._initializer = new bootable.Initializer();

    /**
     * Add phase to boot sequence.
     *
     * @return {Object} for chaining
     * @api public
     */
    app.phase = function() {
        var fns = flatten(slice.call(arguments));
        for (var i = 0; i < fns.length; ++i) {
            this._initializer.phase(fns[i]);
        }
        return this;
    };

    /**
     * Boot application.
     *
     * @param {String|*} [env]
     * @param {Function} cb
     * @param {Object} [thisArg]
     * @api public
     */
    app.boot = function(env, cb, thisArg) {
        if (typeof env === 'function') {
            cb = env;
            env = undefined;
        }
        this.env = env || process.env.NODE_ENV || 'development';
        this._initializer.run(cb, thisArg || app);
    };

    return app;
};

exports.configure = require('./phases/configure');
exports.initializers = require('./phases/initializers');