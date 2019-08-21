// Scenario with bad DvP class
const { Party } = require('../js/sc-lib')
const { DvP, Bond, Cash } = require('../js/dvp-bad')

const bob = new Party('Bob')
const cathy = new Party('Cathy')

const ownerIs = other => obj => (obj.owner && obj.owner.equal(other))

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

const newDvP = (arg) => {
    return new DvP(arg)
}

const showOwners = (dvp) => {
    console.log(`Bond owner = ${dvp.bond.owner.cert}`)
    console.log(`Cash owner = ${dvp.cash.owner.cert}`)
    console.log()
}

describe('Bad DvP impl', () => {
    test('when both successful', () => {
        const bond = newBond()
        const cash = newCash()
        const dvp = newDvP({ bond, cash })

        // pre
        showOwners(dvp)
        expect(bond).toSatisfy(ownerIs(bob))
        expect(cash).toSatisfy(ownerIs(cathy))

        // if it goes well, no problem
        console.log('executing DvP settlement...')
        expect(dvp.settle()).toBe(true)

        // post
        showOwners(dvp)
        expect(bond).toSatisfy(ownerIs(cathy))
        expect(cash).toSatisfy(ownerIs(bob))
    })

    test('when cash.transfer fails', () => {
        const bond = newBond()
        const cash = newCash()
        const dvp = newDvP({ bond, cash })

        // pre
        showOwners(dvp)
        expect(bond).toSatisfy(ownerIs(bob))
        expect(cash).toSatisfy(ownerIs(cathy))

        // mock cash.transfer to fail
        cash.transfer = jest.fn().mockImplementation(() => { throw Error('Cash transfer failed!') })

        // cash.transfer fails, but it does not rollback...
        console.log('executing DvP settlement...')
        expect(dvp.settle()).toBe(false)

        // post
        // Both cash and bond belong to Cathy!!!!
        showOwners(dvp)
        expect(bond).toSatisfy(ownerIs(cathy))
        expect(cash).toSatisfy(ownerIs(cathy))
    })
})
