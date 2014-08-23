var initializers = require('../../lib/phases/initializers');
var s = require('../support');
var t = s.t;

describe('phases/initializers', function() {

    it('should export a setup function', function() {
        t.isFunction(initializers);
    });

    describe('phase with string argument', function() {
        var app = {};
        app.order = [];

        var error = 'error';

        before(function(done) {
            global.__app = app;

            var phase = initializers(__dirname + '/../fixtures/initializers/test');
            phase.call(app, function(err) {
                error = err;
                delete global.__app;
                return done();
            });
        });

        it('should call callback', function() {
            t.isUndefined(error);
        });
        it('should run initializers in correct order', function() {
            t.lengthOf(app.order, 3);
            t.deepEqual(app.order, ['01_async', '02_sync', '03_require']);
        });
    });

    describe('phase with dirname option', function() {
        var app = {};
        app.order = [];

        var error;

        before(function(done) {
            var phase = initializers({ dir: __dirname + '/../fixtures/initializers/test' });
            phase.call(app, function(err) {
                error = err;
                return done();
            });
        });

        it('should call callback', function() {
            t.isUndefined(error);
        });
        it('should run initializers in correct order', function() {
            t.lengthOf(app.order, 2);
            t.equal(app.order[0], '01_async');
            t.equal(app.order[1], '02_sync');
        });
    });

    describe('phase with initializer that calls done with error', function() {
        var app = {};
        app.order = [];

        var error;

        before(function(done) {
            var phase = initializers(__dirname + '/../fixtures/initializers/error-done');
            phase.call(app, function(err) {
                error = err;
                return done();
            });
        });

        it('should call callback', function() {
            t.instanceOf(error, Error);
            t.equal(error.message, 'something went wrong');
        });
        it('should halt initializers after error', function() {
            t.lengthOf(app.order, 0);
        });
    });

    describe('phase with initializer that throws exception', function() {
        var app = {};
        app.order = [];

        var error;

        before(function(done) {
            var phase = initializers(__dirname + '/../fixtures/initializers/error-throw');
            phase.call(app, function(err) {
                error = err;
                return done();
            });
        });

        it('should call callback', function() {
            t.instanceOf(error, Error);
            t.equal(error.message, 'something went horribly wrong');
        });
        it('should halt initializers after error', function() {
            t.lengthOf(app.order, 0);
        });
    });

});
