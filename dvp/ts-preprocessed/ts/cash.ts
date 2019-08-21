const chalk = require('chalk')
const r = chalk.red
const g = chalk.green
import { Party } from './dsl4sc'

export class Cash {
    issuer: Party
    owner: Party
    oldOwner: Party
    currency: string
    amount: number
    _fail: boolean = false

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
        if (this._fail) {
            console.error(`  ${r('Cash transfer failed!')}`)
            throw new Error('Cash transfer failed!')
        }
        this.oldOwner = this.owner
        this.owner = arg.newOwner
        console.log(g('  Cash transfer success'))
    }

    rollback() {
        if (this.oldOwner) {
            this.owner = this.oldOwner
            this.oldOwner = null
        }
    }

    // for demo
    toFail(): this {
        this._fail = true
        return this
    }
}
