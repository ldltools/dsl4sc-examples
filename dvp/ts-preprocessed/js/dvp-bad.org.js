"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dsl4sc_1 = require("./dsl4sc");
const bond_1 = require("./bond");
exports.Bond = bond_1.Bond;
const cash_1 = require("./cash");
exports.Cash = cash_1.Cash;
// Bad implementation example
class DvP extends dsl4sc_1.StateMachine {
    constructor({ bond, cash }) {
        super();
        this.bond = bond;
        this.cash = cash;
        this.seller = this.bond.owner;
        this.buyer = this.cash.owner;
    }
    // settle() executes transfer operations.
    // This returns if the operation was successful.
    // This transaction will be recorded on peer's leader
    // regardless whether it was successful or not.
    settle() {
        this.raise("bond_transfer");
    }
    bond_transfer() {
        try {
            this.bond.transfer({ newOwner: this.buyer });
            this.raise('bond_transfer_ok');
        }
        catch (e) {
            this.raise('bond_transfer_ng');
        }
    }
    bond_transfer_ok() { this.raise('cash_transfer'); }
    bond_transfer_ng() { this.raise('settle_ng'); }
    cash_transfer() {
        try {
            this.cash.transfer({ newOwner: this.seller });
            this.raise('cash_transfer_ok');
        }
        catch (e) {
            this.raise('cash_transfer_ng');
        }
    }
    cash_transfer_ok() { this.raise('settle_ok'); }
    cash_transfer_ng() { this.raise('settle_ng'); }
    settle_ok() { return true; }
    settle_ng() { return false; }
}
exports.DvP = DvP;
