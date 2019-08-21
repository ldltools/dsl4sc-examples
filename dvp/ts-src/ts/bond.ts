import { Party } from './sc-lib'

export class Bond {
    state: string
    issuer: Party
    owner: Party
    oldOwner: Party
    isin: string
    amount: number

    constructor(arg: {
        issuer: Party
        owner: Party
        isin: string
        amount: number
    }) {
        this.issuer = arg.issuer
        this.owner = arg.owner
        this.isin = arg.isin
        this.amount = arg.amount
    }

    transfer({ newOwner }: { newOwner: Party }) {
        this.oldOwner = this.owner
        this.owner = newOwner
    }

    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner
            this.oldOwner = null
        }
    }
}
