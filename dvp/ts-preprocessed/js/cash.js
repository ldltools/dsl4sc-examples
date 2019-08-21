"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
const r = chalk.red;
const g = chalk.green;
class Cash {
    constructor(arg) {
        this._fail = false;
        this.issuer = arg.issuer;
        this.owner = arg.owner;
        this.amount = arg.amount;
        this.currency = arg.currency;
    }
    transfer(arg) {
        if (this._fail) {
            console.error(`  ${r('Cash transfer failed!')}`);
            throw new Error('Cash transfer failed!');
        }
        this.oldOwner = this.owner;
        this.owner = arg.newOwner;
        console.log(g('  Cash transfer success'));
    }
    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner;
            this.oldOwner = null;
        }
    }
    // for demo
    toFail() {
        this._fail = true;
        return this;
    }
}
exports.Cash = Cash;
