//
// usage: node dvp.demo.js (good|bad) [fail]
//   - good: run good DvP, bad: run bad DvP
//   - fail (any string): if exists, cash.transfer fails
//

const chalk = require('chalk')

// bevaior config
const badDvP = process.argv[2] === 'bad'
const cashFail = process.argv.length >= 4

const { Party } = require('../js/dsl4sc')
const { DvP, Bond, Cash } =
    badDvP ? require('../js/dvp-bad') : require('../js/dvp-good')

const bob = new Party('Bob')
const cathy = new Party('Cathy')

const gr = chalk.gray
const r = chalk.red
const g = chalk.green

const newBond = () => {
    return new Bond({
        issuer: new Party('abc corporation'),
        owner: bob,
        isin: 'XXX',
        amount: 1000,
    })
}

const newCash = () => {
    return new Cash({
        issuer: new Party('central bank'),
        owner: cathy,
        currency: 'USD',
        amount: 1000000,
    })
}

const dvp = new DvP({
    bond: newBond(),
    cash: cashFail ? newCash().toFail() : newCash()
})
dvp.showOwners()

console.log('------------------')
console.log(cashFail ? 'error  operaration' : 'normal operaration')
console.log('------------------')
console.log()

const eventREPL = () => {
    dvp.raise('main')

    while (dvp._queue.length > 0) {
        const ev = dvp._queue.shift()
        console.log(`${gr('processing event')} ${ev}${gr('...')}`)
        // if (ev === 'main_ok') {
        //     console.log(g('TX processing completed'))
        //     return 1
        // }
        if (!dvp[ev]) {
            console.error(`no event handler for event ${ev}. abort.`)
            return 0
        }
        dvp[ev]()
    }
    // console.log(g('TX processing completed'))
    return 1
}

try {
    eventREPL()
    dvp.showOwners()
} catch (e) {
    console.error()
    console.error(r('TX abort: illegal event sequence:'))
    console.error(r('  ' + e.message))
    console.error()
}
