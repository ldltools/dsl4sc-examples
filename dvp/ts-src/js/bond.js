"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }
    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner;
            this.oldOwner = null;
        }
    }
}
exports.Bond = Bond;
