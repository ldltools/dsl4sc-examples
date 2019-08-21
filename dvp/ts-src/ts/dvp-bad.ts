//
// DVP bad implementation example
//

import { Party } from './sc-lib'
import { Bond } from './bond'
import { Cash } from './cash'

export class DvP {
    bond: Bond
    cash: Cash
    seller: Party
    buyer: Party


    // settle() executes transfer operations.
    // This returns a boolean value that denotes if operations would be successful or not.
    // This transaction will be recorded on peers' leader regardless of the result.
    settle(): boolean {
        try {
            this.bond.transfer({ newOwner: this.buyer })
            this.cash.transfer({ newOwner: this.seller })
            return true
        } catch (e) {   // catch the exception
            return false
        }
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
