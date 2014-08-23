/**
 * Module dependencies.
 */
var path = require('path');
var fs = require('fs');
var existsSync = fs.existsSync || path.existsSync; // node <=0.6
var debug = require('debug')('yetta:initializers');


/**
 * Initializer execution phase.
 *
 * This phase will execute all initializer scripts in a directory, allowing the
 * application to initialize modules, including connecting to databases and
 * other network services.
 *
 * Examples:
 *
 *   yetta.phase(initializers());
 *
 *   yetta.phase(initializers('config/initializers'));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function (options) {
    if (typeof options === 'string') {
        options = { dirname: options };
    }
    options = options || {};

    var extensions = options.extensions || Object.keys(require.extensions).map(function (ext) {
        return ext;
    });
    var exts = extensions.map(function (ext) {
        if (ext[0] !== '.') return ext;
        return ext.slice(1);
    });
    var regex = new RegExp('\\.(' + exts.join('|') + ')$');

    return function initializers(done) {
        var dirname = options.dirname || 'config/initializers';
        var dir = path.resolve(dirname);
        if (!existsSync(dir)) return done();

        var self = this;
        var files = fs.readdirSync(dir).sort();
        var idx = 0;

        function next(err) {
            if (err) {
                return done(err);
            }

            var file = files[idx++];
            // all done
            if (!file) {
                return done();
            }

            if (regex.test(file)) {
                try {
                    debug('initializer %s', file);
                    var mod = require(path.join(dir, file));
                    if (typeof mod === 'function') {
                        var arity = mod.length;
                        if (arity === 1) {
                            // Async initializer.  Exported function will be invoked, with next
                            // being called when the initializer finishes.
                            mod.call(self, next);
                        } else {
                            // Sync initializer.  Exported function will be invoked, with next
                            // being called immediately.
                            mod.call(self);
                            next();
                        }
                    } else {
                        // Initializer does not export a function.  Requiring the initializer
                        // is sufficient to invoke it, next immediately.
                        next();
                    }
                } catch (ex) {
                    next(ex);
                }
            } else {
                next();
            }
        }

        next();
    };
};
