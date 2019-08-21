"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk'); // typeless import
const c = chalk.cyan;
const g = chalk.green;
const y = chalk.yellow;
const m = chalk.magenta;
const dsl4sc_1 = require("./dsl4sc");
const bond_1 = require("./bond");
exports.Bond = bond_1.Bond;
const cash_1 = require("./cash");
exports.Cash = cash_1.Cash;
// Bad implementation example
class DvP extends dsl4sc_1.StateMachine {
    constructor({ bond, cash }) {
        super();
        Object.assign(this, { bond, cash });
        this.seller = this.bond.owner;
        this.buyer = this.cash.owner;
    }
    showOwners() {
        const coloredOwner = (owner) => {
            if (owner.cert === 'Bob') {
                return c(owner.cert);
            }
            return y(owner.cert);
        };
        console.log();
        console.log(`${c('Bond')} owner = ${coloredOwner(this.bond.owner)}`);
        console.log(`${y('Cash')} owner = ${coloredOwner(this.cash.owner)}`);
        console.log();
    }
    main() {
        console.log(g('  TX processing starts'));
        this.raise('settle');
    }
    END() {
        console.log(g('  TX processing completed'));
    }
    settle() {
        this.raise('bond_transfer');
    }
    settle_ok() {
        console.log(g('  settlement success'));
        this.raise('END');
    }
    settle_err() {
        console.log(m('  settlement failed'));
        this.raise('rollback');
    }
    rollback_ok() {
        this.raise('END');
    }
    // bond.transfer
    bond_transfer() {
        try {
            this.bond.transfer({ newOwner: this.buyer });
            this.raise('bond_transfer_ok');
        }
        catch (e) {
            this.raise('bond_transfer_err');
        }
    }
    bond_transfer_ok() {
        this.raise('cash_transfer');
    }
    bond_transfer_err() {
        // this.raise('settle_err')
        this.raise('settle_ok');
    }
    // cash.transfer
    cash_transfer() {
        try {
            this.cash.transfer({ newOwner: this.seller });
            this.raise('cash_transfer_ok');
        }
        catch (e) {
            this.raise('cash_transfer_err');
        }
    }
    cash_transfer_ok() {
        this.raise('settle_ok');
    }
    cash_transfer_err() {
        // this.raise('settle_err')
        this.raise('settle_ok');
    }
    // rollback
    rollback() {
        console.log(m('  rollback operations'));
        this.raise('bond_rollback');
    }
    bond_rollback() {
        this.bond.rollback();
        this.raise('cash_rollback');
    }
    cash_rollback() {
        this.cash.rollback();
        this.raise('rollback_ok');
    }
}
exports.DvP = DvP;
