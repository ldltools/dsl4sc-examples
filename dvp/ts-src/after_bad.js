//
// 変換後のイメージ
// ev_ok, ev_ng は実行成功/失敗 (Promsie 的な意味で) に送信するべきイベント名
// クラスには分けないで書いてある
//

// bad の例
// protocol: main; settle;
//      (
//          bond_transfer; bond_transfer_ok; cash_transfer; cash_transfer_ok; settle_ok; main_ok
//              +
//          (bond_transfer; bond_transfer_ok; cash_transfer; cash_transfer_ng + bond_transfer; bond_transfer_ng); settle_ok; main_ok
//      )

let bond, cash

function raise() { }
function send() { }

// Fabric のTX処理を行っている部分
function main() {
    raise(settle)
}

function main_ok() {
    // return from transaction
}

function settle() {
    raise(bond_transfer)
}

function settle_ok() {
    send(main_ok)
}

function settle_ng() {
    raise(rollback)
}

function rollback_ok() {
    raise(main_ok)
}

// bond.transfer

function bond_transfer() {
    try {
        bond.transfer()
        raise(bond_transfer_ok)
    } catch (e) {
        raise(bond_transfer_ng)
    }
}

function bond_transfer_ok() {
    raise(cash_transfer)
}

function bond_transfer_ng() {
    // raise(settle_ng)
    raise(settle_ok)
}

// cash.transfer

function cash_transfer() {
    try {
        cash.transfer()
        raise(cash_transfer_ok)
    } catch (e) {
        raise(cash_transfer_ng)
    }
}

function cash_transfer_ok() {
    raise(settle_ok)
}

function cash_transfer_ng() {
    // raise(settle_ng)
    raise(settle_ok)
}

// rollback

function rollback() {
    raise(bond_rollback)
}

function bond_rollback() {
    bond.rollback()
    raise(cash_rollback)
}

function cash_rollback() {
    cash.rollback()
    raise(rollback_ok)
}

module.exports = { main }
