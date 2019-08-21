import { initial,transitions } from './decorator'
const chalk = require('chalk'); // typeless import


const c = chalk.cyan;
const g = chalk.green;
const y = chalk.yellow;
const m = chalk.magenta;
import { Party, StateMachine } from './dsl4sc';
import { Bond } from './bond';
import { Cash } from './cash'; // Good implementation example

@initial("q2")
class DvP extends StateMachine {
  bond: Bond;
  cash: Cash;
  seller: Party;
  buyer: Party;

  constructor({
    bond,
    cash
  }: {
    bond: Bond;
    cash: Cash;
  }) {
    super();
    Object.assign(this, {
      bond,
      cash
    });
    this.seller = this.bond.owner;
    this.buyer = this.cash.owner;
  }

  showOwners() {
    const coloredOwner = owner => {
      if (owner.cert === 'Bob') {
        return c(owner.cert);
      }

      return y(owner.cert);
    };

    console.log();
    console.log(`${c('Bond')} owner = ${coloredOwner(this.bond.owner)}`);
    console.log(`${y('Cash')} owner = ${coloredOwner(this.cash.owner)}`);
    console.log();
  }

  main() {
    console.log(g('  TX processing starts'));
    this.raise('settle');
  }

  // expects: _state == "q6" || _state == "q9"
  // ensures: (_state_pre == "q6" && _state == "q8") || (_state_pre == "q9" && _state == "q11")
  @transitions({
    "q6": "q8",
    "q9": "q11"
  })
  END() {
    console.log(g('  TX processing completed'));
  }

  // expects: _state == "q2"
  // ensures: (_state_pre == "q2" && _state == "q4")
  @transitions({
    "q2": "q4"
  })
  settle() {
    this.raise('bond_transfer');
  }

  settle_ok() {
    console.log(g('  settlement success'));
    this.raise('END');
  }

  settle_err() {
    console.log(m('  settlement failed'));
    this.raise('rollback');
  }

  rollback_ok() {
    this.raise('END');
  } // bond.transfer


  // expects: _state == "q4"
  // ensures: (_state_pre == "q4" && _state == "q5")
  @transitions({
    "q4": "q5"
  })
  bond_transfer() {
    try {
      this.bond.transfer({
        newOwner: this.buyer
      });
      this.raise('bond_transfer_ok');
    } catch (e) {
      this.raise('bond_transfer_err');
    }
  }

  bond_transfer_ok() {
    this.raise('cash_transfer');
  }

  // expects: _state == "q5"
  // ensures: (_state_pre == "q5" && _state == "q7")
  @transitions({
    "q5": "q7"
  })
  bond_transfer_err() {
    this.raise('settle_err'); // this.raise('settle_ok')
  } // cash.transfer


  // expects: _state == "q5"
  // ensures: (_state_pre == "q5" && _state == "q6")
  @transitions({
    "q5": "q6"
  })
  cash_transfer() {
    try {
      this.cash.transfer({
        newOwner: this.seller
      });
      this.raise('cash_transfer_ok');
    } catch (e) {
      this.raise('cash_transfer_err');
    }
  }

  cash_transfer_ok() {
    this.raise('settle_ok');
  }

  // expects: _state == "q6"
  // ensures: (_state_pre == "q6" && _state == "q7")
  @transitions({
    "q6": "q7"
  })
  cash_transfer_err() {
    this.raise('settle_err'); // this.raise('settle_ok')
  } // rollback


  // expects: _state == "q7"
  // ensures: (_state_pre == "q7" && _state == "q9")
  @transitions({
    "q7": "q9"
  })
  rollback() {
    console.log(m('  rollback operations'));
    this.raise('bond_rollback');
  }

  bond_rollback() {
    this.bond.rollback();
    this.raise('cash_rollback');
  }

  cash_rollback() {
    this.cash.rollback();
    this.raise('rollback_ok');
  }

  _reset() {
    _state = "q2";
  }

} // rexport for convenience


export { Bond, Cash, DvP };

const assert = require("assert");
