/* global describe, it */

var yetta = require('..');
var s = require('./support');
var t = s.t;

describe('yetta', function() {

    it('should export function', function() {
        t.isFunction(yetta);
    });

    it('should export phases', function() {
        t.isFunction(yetta.configure);
        t.isFunction(yetta.initializers);
    });

});
