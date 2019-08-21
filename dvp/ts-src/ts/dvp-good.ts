import { Party } from './sc-lib'
import { Bond } from './bond'
import { Cash } from './cash'

// Good implementation example
export class DvP {
    bond: Bond
    cash: Cash
    seller: Party
    buyer: Party



    // settle() executes transfer operations.
    // It automatically rollbacks when one of the transfer fails and
    // this transaction will not be recorded on peer's leader.
    settle(): boolean {
        this.bond.transfer({ newOwner: this.buyer })
        this.cash.transfer({ newOwner: this.seller })
        return true
    }



    constructor({ bond, cash }: { bond: Bond, cash: Cash }) {
        this.bond = bond
        this.cash = cash
        this.seller = this.bond.owner
        this.buyer = this.cash.owner
    }
}

// rexport for convenience
export { Bond, Cash }
