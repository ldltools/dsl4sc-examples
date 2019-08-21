"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dsl4sc_1 = require("./dsl4sc");
// preprocessed version
class DvP extends dsl4sc_1.StateMachine {
    constructor({ bond, cash }) {
        super();
        this.bond = bond;
        this.cash = cash;
        this.seller = this.bond.owner;
        this.buyer = this.cash.owner;
    }
    // divided into steps
    settle() {
        this.raise('bond_transfer', { newOwner: this.buyer });
    }
    // Based on the typing of bond.transfer: { newOwner: Party } => void
    // bond_transfer: { newOwner: Party } => void
    bond_transfer(arg) {
        try {
            const ret = this.bond.transfer(arg);
            this.raise('bond_transfer_ok', ret);
        }
        catch (e) {
            this.raise('bond_transfer_ng', e);
        }
    }
    // bond_transfer_ok: void => void (because return type of the bond.transfer is void)
    bond_transfer_ok(ret) {
        this.raise('cash_transfer', { newOwner: this.seller });
    }
    // bond_transfer_ng: Error => void
    bond_transfer_ng(e) {
        this.bond.rollback();
        this.cash.rollback();
        this.raise('settle_ng', e);
    }
    cash_transfer(arg) {
        try {
            const ret = this.cash.transfer(arg);
            this.raise('cash_transfer_ok', ret);
        }
        catch (e) {
            this.raise('cash_transfer_ng', e);
        }
    }
    cash_transfer_ok(ret) {
        this.raise('settle_ok'); // because return type of the original settle() is void
    }
    cash_transfer_ng(e) {
        this.bond.rollback();
        this.cash.rollback();
        this.raise('settle_ng', e);
    }
}
exports.DvP = DvP;
