"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Party {
    constructor(cert) {
        this.cert = cert;
    }
    equal(other) {
        return this.cert === other.cert;
    }
}
exports.Party = Party;
class TimeImpl {
    isFutureOf(other) {
        return true;
    }
    isPastOf(other) {
        return true;
    }
    tick() {
    }
    set(now) {
    }
}
exports.TimeImpl = TimeImpl;
class StoreImpl {
    constructor() {
        this.store = {};
    }
    put(objType, id, value) {
        if (!this.store[objType]) {
            this.store[objType] = {};
        }
        this.store[objType][id] = value;
        return this;
    }
    get(objType, id) {
        return this.store[objType][id];
    }
}
const objStore = new StoreImpl();
class StateMachine {
    constructor(clazz) {
        this._class = clazz;
        this._store = objStore;
    }
}
exports.StateMachine = StateMachine;
