/* global describe, it */

var configure = require('../../lib/phases/configure');
var s = require('../support');
var t = s.t;

describe('phases/configure', function () {

    it('should export a setup function', function () {
        t.isFunction(configure);
    });

    describe('phase with full environments script', function () {
        var app = {};
        app.envs = [];

        var phase = configure(__dirname + '/../fixtures/configure/full');
        phase.call(app);

        it('should load environments', function () {
            t.lengthOf(app.envs, 2);
            t.equal(app.envs[0], 'all');
            t.equal(app.envs[1], 'development');
        });
    });

    describe('phase with only environments dir', function () {
        var app = {};
        app.envs = [];

        var phase = configure(__dirname + '/../fixtures/configure/dir');
        phase.call(app);

        it('should load environments', function () {
            t.lengthOf(app.envs, 1);
            t.equal(app.envs[0], 'development');
        });
    });

    describe('phase with only environment script', function () {
        var app = {};
        app.envs = [];

        var phase = configure(__dirname + '/../fixtures/configure/env');
        phase.call(app);

        it('should load environments', function () {
            t.lengthOf(app.envs, 1);
            t.equal(app.envs[0], 'all');
        });
    });

    describe('phase with dir and env options', function () {
        var app = {};
        app.envs = [];

        var phase = configure({ dir: __dirname + '/../fixtures/configure/dir', env: 'production' });
        phase.call(app);

        it('should load environments', function () {
            t.lengthOf(app.envs, 1);
            t.equal(app.envs[0], 'production');
        });
    });

    describe('phase with environment that lacks a script', function () {
        var app = {};
        app.envs = [];

        var phase = configure({ dir: __dirname + '/../fixtures/configure/dir', env: 'test' });
        phase.call(app);

        it('should load environments', function () {
            t.equal(app.envs, 0);
        });
    });

    describe('phase with environment that throw an error', function () {
        var app = {};
        app.envs = [];

        var phase = configure(__dirname + '/../fixtures/configure/error');

        it('should throw error', function () {
            t.throws(function () {
                phase.call(app);
            });
        });
    });

    describe('phase with helpers', function () {
        var app;

        beforeEach(function () {
            app = {};
            app.name = 'AppFoo';
            app.env = 'development';
            app.settings = {};
            var phase = configure(__dirname + '/../fixtures/configure/configs');
            phase.call(app);
        });

        it('#loadConfigs', function () {
            t.deepEqual(app.settings.a, {foo: 'bar'});
            t.deepEqual(app.settings.b, {foo: 'bar'});
            t.deepEqual(app.settings.c, {foo: app.name});
            t.notOk('d' in app.settings);
        });

    });

});
