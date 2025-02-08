class TickNotifier {
    static ownkey = 'check ownKey of TickNotifier';
    static _instance: TickNotifier | null = null;
    private _subscribers: Array<() => void> = [];
    private _timeOutID: any = null;

    private constructor() {}

    static getInstance() {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private _nofify() {
        if (!this._subscribers.length) return;
        this._subscribers.forEach(fn => fn());
        this._timeOutID = setTimeout(() => this._nofify(), 50);
    }

    subscribeUpdatesAndNotife(subscriber: () => void) {
        this._subscribers.push(subscriber);
        if (!this._subscribers.length) return;
        this._nofify();
    }

    unsubscribe(subscriber: () => void) {
        const foundIndex = this._subscribers.findIndex(fn => fn === subscriber);
        if (foundIndex === -1) return;
        this._subscribers.splice(foundIndex, 1);
    }

    getSubscribers(): typeof this._subscribers {
        return this._subscribers;
    }

    destroy() {
        clearTimeout(this._timeOutID);
        TickNotifier._instance = null;
    }
}

export default TickNotifier;