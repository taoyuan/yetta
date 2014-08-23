"use strict";

var bootable = require('bootable');

/**
 * Make `app` yettable.
 *
 * This function makes an application yettable.  Booting consists of executing
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

    /**
     * Add phase to boot sequence.
     *
     * @param {Function|[Function]} fns
     * @return {Object} for chaining
     * @api public
     */
    app.phase = function(fns) {
        if (Array.isArray(fns)) {
            for (var i = 0; i < fns.length; ++i) {
                this._initializer.phase(fns[i]);
            }
        }  else {
            this._initializer.phase(fns);
        }

        return this;
    };

    return app;
};

exports.configure = require('./phases/configure');
exports.initializers = require('./phases/initializers');