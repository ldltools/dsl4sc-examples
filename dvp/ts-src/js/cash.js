"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cash {
    constructor(arg) {
        this.issuer = arg.issuer;
        this.owner = arg.owner;
        this.amount = arg.amount;
        this.currency = arg.currency;
    }
    transfer(arg) {
        this.oldOwner = this.owner;
        this.owner = arg.newOwner;
    }
    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner;
            this.oldOwner = null;
        }
    }
}
exports.Cash = Cash;
