class TickNotifier {
    static _instance: TickNotifier | null = null;
    private _subscribers: Array<() => void> = [];
    private _timeOutID: any = null;

    private constructor() {}

    static getInstance() {
        if (!TickNotifier._instance) {
            TickNotifier._instance = new TickNotifier();
        }

        return TickNotifier._instance;
    }

    private _notify() {
        // if (!this._subscribers.length) return;
        // this._subscribers.forEach(fn => fn());
        // this._timeOutID = setTimeout(() => this._notify(), 2000);
    }

    subscribe(subscriber: () => void) {
        this._subscribers.push(subscriber);
    }

    unsubscribe(subscriber: () => void) {
        this._subscribers = this._subscribers.filter(fn => fn !== subscriber);
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