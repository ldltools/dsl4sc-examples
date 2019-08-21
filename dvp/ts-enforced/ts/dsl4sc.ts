export class Party {
    cert: string
    constructor(cert: string) {
        this.cert = cert
    }
    equal(other: Party): boolean {
        return this.cert === other.cert
    }
}

export interface Time {
    isFutureOf(other: Time): boolean
    isPastOf(other: Time): boolean
    tick(): void
    set(now: string): void
}

export class TimeImpl implements Time {
    isFutureOf(other: Time): boolean {
        return true
    }
    isPastOf(other: Time): boolean {
        return true
    }
    tick(): void {
    }
    set(now: string): void {
    }
}

interface Store {
    put(objType: string, id: string, value: any): this
    get(objType: string, id: string): any
}

class StoreImpl {
    store = {}

    put(objType: string, id: string, value: any): this {
        if (!this.store[objType]) {
            this.store[objType] = {}
        }
        this.store[objType][id] = value
        return this
    }
    get(objType: string, id: string): any {
        return this.store[objType][id]
    }
}

const objStore = new StoreImpl()

export class StateMachine {
    _class: string
    _id: string
    _state: string
    _time: Time
    _sender: Party
    _store: Store
    _queue: string[]

    constructor(clazz?: string) {
        // this._class = clazz
        // this._store = objStore
        this._queue = []
    }

    raise(event: string, ...rest: any[]) {
        this._queue.push(event)
    }
}
