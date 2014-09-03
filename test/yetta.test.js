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


    describe('mixing into application', function() {
        var app = {};
        app.name = 'AppFoo';

        yetta(app);

        it('should mixin phase function', function() {
            t.isFunction(app.phase);
        });

        it('should mixin boot function', function() {
            t.isFunction(app.boot);
        });

        describe('registering and running phases', function() {
            var order = [];

            app.phase(function() {
                var name = this !== global ? this.name : 'global';
                order.push('1:' + name);
            });
            app.phase(function(done) {
                var self = this;
                process.nextTick(function() {
                    var name = self !== global ? self.name : 'global';
                    order.push('2:' + name);
                    return done();
                });
            });
            app.phase(function() {
                var name = this !== global ? this.name : 'global';
                order.push('3:' + name);
            });


            var error;

            before(function(done) {
                app.boot(function(err) {
                    error = err;
                    return done();
                });
            });

            it('should call callback', function() {
                t.isUndefined(error);
            });
            it('should run phases in correct order', function() {
                t.lengthOf(order, 3);
                t.equal(order[0], '1:AppFoo');
                t.equal(order[1], '2:AppFoo');
                t.equal(order[2], '3:AppFoo');
            });
        });
    });

    describe('mixing in with phases', function() {
        var app = {};
        app.name = 'AppFoo';
        var order = [];

        function phase1() {
            var name = this !== global ? this.name : 'global';
            order.push('1:' + name);
        }
        function phase2(done) {
            var self = this;
            process.nextTick(function() {
                var name = self !== global ? self.name : 'global';
                order.push('2:' + name);
                return done();
            });
        }
        function phase3() {
            var name = this !== global ? this.name : 'global';
            order.push('3:' + name);
        }

        yetta(app).phase(phase1, phase2, phase3);

        describe('running phases', function() {
            var error;

            before(function(done) {
                app.boot(function(err) {
                    error = err;
                    return done();
                });
            });

            it('should call callback', function() {
                t.isUndefined(error);
            });
            it('should run phases in correct order', function() {
                t.lengthOf(order, 3);
                t.equal(order[0], '1:AppFoo');
                t.equal(order[1], '2:AppFoo');
                t.equal(order[2], '3:AppFoo');
            });
        });
    });

});
