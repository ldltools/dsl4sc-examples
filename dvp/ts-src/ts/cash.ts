import { Party } from './sc-lib'

export class Cash {
    issuer: Party
    owner: Party
    oldOwner: Party
    currency: string
    amount: number

    constructor(arg: {
        issuer: Party
        owner: Party
        currency: string
        amount: number
    }) {
        this.issuer = arg.issuer
        this.owner = arg.owner
        this.amount = arg.amount
        this.currency = arg.currency
    }

    transfer(arg: { newOwner: Party }) {
        this.oldOwner = this.owner
        this.owner = arg.newOwner
    }

    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner
            this.oldOwner = null
        }
    }
}
