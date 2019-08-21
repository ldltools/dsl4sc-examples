//
// オリジナルのコードの振る舞いのイメージ
// クラスには分けないで書いてある
//

let bond, cash

// Fabric のTX処理を行っている部分
function main() {
    try {
        settle()
    } catch (e) {
        rollback()
    }
}

// good
function settle() {
    bond.transfer()
    cash.transfer()
    return true
}

// bad
function settle() {
    try {
        bond.transfer()
        cash.transfer()
        return true
    } catch (e) {
        return false
    }
}

function rollback() {
    bond.rollback()
    cash.rollback()
}
