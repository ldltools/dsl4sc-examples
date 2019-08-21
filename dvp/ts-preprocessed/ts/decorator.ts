import { Party } from './dsl4sc'

const assert = require('assert').strict

// class decorator
export function initial(state: string) {
    return function <T extends {
        new(...args: any[]): {
            _state: string
        }
    }>(constructor: T) {
        return class extends constructor {
            constructor(...args) {
                super(...args)
                this._state = state
            }
        }
    }
}

// method decorators

interface TransitionMap {
    [state: string]: string
}

export function transitions(trans: TransitionMap) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value
        descriptor.value = function (...args) {
            // console.error(`valid when at ${state} state`)
            assert.ok(trans[this._state], `event ${theMethod.name} should not be triggered at internal state ${this._state}`)
            const ret = theMethod.apply(this, args)
            this._state = trans[this._state]
            return ret
        }
        return descriptor
    }
}

export function atstate(state: string) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value
        descriptor.value = function (...args) {
            console.error(`valid when at ${state} state`)
            assert.ok(this._state === state)
            return theMethod.apply(this, args)
        }
        return descriptor
    }
}

export function nextstate(state: string) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value
        descriptor.value = function (...args) {
            console.error(`go to ${state} state`)
            const ret = theMethod.apply(this, args)
            this._state = state
            return ret
        }
        return descriptor
    }
}

export function controller(party: Party) {
    return function (target, key, descriptor) {
    }
}

export function pre(cond: (any) => boolean) {
    return function (target, key, descriptor) {
        const theMethod = descriptor.value
        descriptor.value = function (...args) {
            console.error(`checking precondition: ${cond}`)
            assert.ok(cond.apply(this, args))
            return theMethod.apply(this, args)
        }
        return descriptor
    }
}
