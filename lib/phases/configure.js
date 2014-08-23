/**
 * Module dependencies.
 */
var scripts = require('scripts');
var path = require('path');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync; // <=0.6
var debug = require('debug')('yetta:configure');


/**
 * Environment initialization phase.
 *
 * This phase will load an environment initialization script based on the
 * current environment (as set by `NODE_ENV`).  As a special case, if an
 * `all.js` script exists, that file will be loaded for *all* environments,
 * prior to the environment-specific script itself.
 *
 * Examples:
 *
 *   yetta.phase(configure('config'));
 *
 *   yetta.phase(configure({ dirname: 'config', env: 'test' }));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
    if (typeof options === 'string') {
        options = { dirname: options };
    }
    options = options || {};
    var dirname = options.dirname || 'config';
    var extensions = options.extensions;

    return function configure() {
        var env = options.env || this.env || process.env.NODE_ENV || 'development';
        var file = path.join(dirname, 'environment');
        var script = scripts.resolve(path.resolve(file), extensions);

        if (existsSync(script)) {
            debug('configuring root environment');
            require(script).call(this);
        }

        file = path.join(dirname, 'environments', 'all');
        script = scripts.resolve(path.resolve(file), extensions);

        if (existsSync(script)) {
            debug('configuring environment: %s', 'all');
            require(script).call(this);
        }

        file = path.join(dirname, 'environments', env);
        script = scripts.resolve(path.resolve(file), extensions);

        if (existsSync(script)) {
            debug('configuring environment: %s', env);
            require(script).call(this);
        }
    };
};
