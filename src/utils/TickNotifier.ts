const SECOND: number = 1000; // ms
const DELAY: number = 50;   // ms

export const COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND: number = SECOND / DELAY;

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
        if (!this._subscribers.length) return;
        this._subscribers.forEach(fn => fn());
        this._timeOutID = setTimeout(() => this._notify(), DELAY);
    }

    subscribe(subscriber: () => void) {
        this._subscribers.push(subscriber);
        this._notify();
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