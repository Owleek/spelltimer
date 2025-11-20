const SECOND: number = 1000; // ms
const DELAY: number = 50;   // ms

export const COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND: number = SECOND / DELAY;

class TickNotifier {
    static _instance: TickNotifier | null = null;
    static _worker: Worker | null = null;
    private _subscribers: Array<() => void> = [];

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
        TickNotifier._worker = new Worker(new URL('./worker.js', import.meta.url));
        TickNotifier._worker.postMessage(DELAY);

        TickNotifier._worker.onmessage = () => {
            if (!this._subscribers.length) return;
            this._subscribers.forEach(fn => fn());
        }
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
        TickNotifier._worker?.terminate();
        TickNotifier._instance = null;
    }
}

export default TickNotifier;

