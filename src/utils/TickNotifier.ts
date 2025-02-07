class TickNotifier {
    static _instance: TickNotifier | null = null;

    private _subscribers: Array<() => void> = [];
    private _tick: number = 0;
    private constructor() {}

    static getInstance() {
        if (!TickNotifier._instance) {
            TickNotifier._instance = new TickNotifier();
        }

        return TickNotifier._instance;
    }

    subscribeUpdatesAndNotife(subscriber: () => void) {
        this._subscribers.push(subscriber);
    }

    unsubscribe(subscriber: () => void) {
        const foundIndex = this._subscribers.findIndex(fn => fn === subscriber);

        if (foundIndex === -1) return;

        this._subscribers.splice(foundIndex, 1);
    }

}

export default TickNotifier;