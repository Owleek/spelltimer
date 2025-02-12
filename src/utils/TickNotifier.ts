const SECOND: number = 1000; // ms
const DELAY: number = 50;   // ms

export const COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND: number = SECOND / DELAY;

class TickNotifier {
    static _instance: TickNotifier | null = null;
    private _subscribers: Array<() => void> = [];
    private _intervalID: any = null;

    private constructor() {
        this._notify();
    }

    static getInstance() {
        if (!TickNotifier._instance) {
            TickNotifier._instance = new TickNotifier();
        }

        return TickNotifier._instance;
    }

    private _notify() {
        this._intervalID = setInterval(() => {
            if (!this._subscribers.length) return;
            this._subscribers.forEach(fn => fn());
        }, DELAY);
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
        clearInterval(this._intervalID);
        TickNotifier._instance = null;
    }
}

export default TickNotifier;