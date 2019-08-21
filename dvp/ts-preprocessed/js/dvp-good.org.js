"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Good implementation example
class DvP {
    constructor({ bond, cash }) {
        this.bond = bond;
        this.cash = cash;
        this.seller = this.bond.owner;
        this.buyer = this.cash.owner;
    }
    // settle() executes transfer operations.
    // It automatically rollbacks when one of the transfer fails and
    // this transaction will not be recorded on peer's leader.
    settle() {
        this.bond.transfer({ newOwner: this.buyer });
        this.cash.transfer({ newOwner: this.seller });
        return true;
    }
}
exports.DvP = DvP;
