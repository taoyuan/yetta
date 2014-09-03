/**
 * Module dependencies.
 */

var debug = require('debug')('yetta:configure');
var resolve = require('resolve');
var path = require('path');

var helper = require('../helper');

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
 *   yetta.phase(configure({ dir: 'config', env: 'test' }));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
    if (typeof options === 'string') {
        options = { dir: options };
    }
    options = options || {};
    var dir = options.dir || './config';
    var extensions = options.extensions;

    return function configure() {
        var env = options.env || this.env || process.env.NODE_ENV || 'development';
        var mod, file;
        var opts = {extensions: extensions};
        var h = helper(this);

        file = path.join(dir, 'environment');
        try {
            mod = resolve.sync(path.resolve(file), opts);
            debug('configuring root environment');
            require(mod).call(this, h);
        } catch (e) {
            assert(e);
        }

        file = path.join(dir, 'environments', 'all');
        try {
            mod = resolve.sync(path.resolve(file), opts);
            debug('configuring environment: %s', 'all');
            require(mod).call(this, h);
        } catch (e) {
            assert(e);
        }

        file = path.join(dir, 'environments', env);
        try {
            mod = resolve.sync(path.resolve(file), opts);
            debug('configuring environment: %s', env);
            require(mod).call(this, h);
        } catch (e) {
            assert(e);
        }
    };
};

function assert(e) {
    if (e && !/^Cannot\ find\ module/.test(e.message)) throw e;
}