"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert').strict;
// class decorator
function initial(state) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                this._state = state;
            }
        };
    };
}
exports.initial = initial;
function transitions(trans) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value;
        descriptor.value = function (...args) {
            // console.error(`valid when at ${state} state`)
            assert.ok(trans[this._state], `event ${theMethod.name} should not be triggered at internal state ${this._state}`);
            const ret = theMethod.apply(this, args);
            this._state = trans[this._state];
            return ret;
        };
        return descriptor;
    };
}
exports.transitions = transitions;
function atstate(state) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value;
        descriptor.value = function (...args) {
            console.error(`valid when at ${state} state`);
            assert.ok(this._state === state);
            return theMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.atstate = atstate;
function nextstate(state) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value;
        descriptor.value = function (...args) {
            console.error(`go to ${state} state`);
            const ret = theMethod.apply(this, args);
            this._state = state;
            return ret;
        };
        return descriptor;
    };
}
exports.nextstate = nextstate;
function controller(party) {
    return function (target, key, descriptor) {
    };
}
exports.controller = controller;
function pre(cond) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value;
        descriptor.value = function (...args) {
            console.error(`checking precondition: ${cond}`);
            assert.ok(cond.apply(this, args));
            return theMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.pre = pre;
