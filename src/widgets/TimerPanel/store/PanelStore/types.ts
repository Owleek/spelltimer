export enum PanelState {
    UNSET = 'unset',
    SET = 'set',
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused'
}

export interface IPanelStore {
    state: PanelState
    actions: {
        setSet: () => void
        setReady: () => void
        setRunning: () => void
        setPaused: () => void
        setUnset: () => void
    }
}