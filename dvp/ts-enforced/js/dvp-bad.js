"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("./decorator");
const chalk = require('chalk'); // typeless import
const c = chalk.cyan;
const g = chalk.green;
const y = chalk.yellow;
const m = chalk.magenta;
const dsl4sc_1 = require("./dsl4sc");
const bond_1 = require("./bond");
exports.Bond = bond_1.Bond;
const cash_1 = require("./cash"); // Bad implementation example
exports.Cash = cash_1.Cash;
let DvP = class DvP extends dsl4sc_1.StateMachine {
    constructor({ bond, cash }) {
        super();
        Object.assign(this, {
            bond,
            cash
        });
        this.seller = this.bond.owner;
        this.buyer = this.cash.owner;
    }
    showOwners() {
        const coloredOwner = owner => {
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
    // expects: _state == "q7" || _state == "q8"
    // ensures: (_state_pre == "q7" && _state == "q9") || (_state_pre == "q8" && _state == "q9")
    END() {
        console.log(g('  TX processing completed'));
    }
    // expects: _state == "q2"
    // ensures: (_state_pre == "q2" && _state == "q4")
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
    } // bond.transfer
    // expects: _state == "q4"
    // ensures: (_state_pre == "q4" && _state == "q5")
    bond_transfer() {
        try {
            this.bond.transfer({
                newOwner: this.buyer
            });
            this.raise('bond_transfer_ok');
        }
        catch (e) {
            this.raise('bond_transfer_err');
        }
    }
    bond_transfer_ok() {
        this.raise('cash_transfer');
    }
    // expects: _state == "q5"
    // ensures: (_state_pre == "q5" && _state == "q6")
    bond_transfer_err() {
        // this.raise('settle_err')
        this.raise('settle_ok');
    } // cash.transfer
    // expects: _state == "q5"
    // ensures: (_state_pre == "q5" && _state == "q7")
    cash_transfer() {
        try {
            this.cash.transfer({
                newOwner: this.seller
            });
            this.raise('cash_transfer_ok');
        }
        catch (e) {
            this.raise('cash_transfer_err');
        }
    }
    cash_transfer_ok() {
        this.raise('settle_ok');
    }
    // expects: _state == "q7"
    // ensures: (_state_pre == "q7" && _state == "q6")
    cash_transfer_err() {
        // this.raise('settle_err')
        this.raise('settle_ok');
    } // rollback
    // expects: _state == "q6"
    // ensures: (_state_pre == "q6" && _state == "q8")
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
    _reset() {
        this._state = "q2";
    }
}; // rexport for convenience
__decorate([
    decorator_1.transitions({
        "q7": "q9",
        "q8": "q9"
    })
], DvP.prototype, "END", null);
__decorate([
    decorator_1.transitions({
        "q2": "q4"
    })
], DvP.prototype, "settle", null);
__decorate([
    decorator_1.transitions({
        "q4": "q5"
    })
], DvP.prototype, "bond_transfer", null);
__decorate([
    decorator_1.transitions({
        "q5": "q6"
    })
], DvP.prototype, "bond_transfer_err", null);
__decorate([
    decorator_1.transitions({
        "q5": "q7"
    })
], DvP.prototype, "cash_transfer", null);
__decorate([
    decorator_1.transitions({
        "q7": "q6"
    })
], DvP.prototype, "cash_transfer_err", null);
__decorate([
    decorator_1.transitions({
        "q6": "q8"
    })
], DvP.prototype, "rollback", null);
DvP = __decorate([
    decorator_1.initial("q2")
], DvP);
exports.DvP = DvP;
const assert = require("assert");
