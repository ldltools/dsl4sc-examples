"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bond_1 = require("./bond");
exports.Bond = bond_1.Bond;
const cash_1 = require("./cash");
exports.Cash = cash_1.Cash;
// Bad implementation example
class DvP {
    constructor({ bond, cash }) {
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
        try {
            this.bond.transfer({ newOwner: this.buyer });
            this.cash.transfer({ newOwner: this.seller });
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.DvP = DvP;
