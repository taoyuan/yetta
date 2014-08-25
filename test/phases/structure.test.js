"use strict";

var structure = require('../../lib/phases/structure');
var s = require('../support');
var t = s.t;

describe('phases/structure', function() {

    it('should export a setup function', function () {
        t.isFunction(structure);
    });

    describe('load from dir', function () {
        var app = {};
        var phase = structure(__dirname + '/../fixtures/structure/controllers');
        phase.call(app);

        it('should load all modules', function () {
            var controllers = app.structure.controllers;
            var mods = Object.keys(controllers);
            t.sameMembers(mods, ['a', 'b', 'c']);
            t.isFunction(controllers['a']);
            t.equal(controllers['a'].name, 'a');
            t.isObject(controllers['b']);
            t.equal(controllers['b'].name, 'b');
        });
    });

});