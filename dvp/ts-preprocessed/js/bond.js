"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
const r = chalk.red;
const g = chalk.green;
class Bond {
    constructor(arg) {
        this.issuer = arg.issuer;
        this.owner = arg.owner;
        this.isin = arg.isin;
        this.amount = arg.amount;
    }
    transfer({ newOwner }) {
        this.oldOwner = this.owner;
        this.owner = newOwner;
        console.log(g('  Bond transfer success'));
    }
    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner;
            this.oldOwner = null;
        }
    }
}
exports.Bond = Bond;
