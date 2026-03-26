import { create } from 'zustand'
import { IPanelStore, PanelState } from './types'

export const usePanelStore = create<IPanelStore>((set) => ({
    state: PanelState.UNSET,
    actions: {
        setSet: () => set({ state: PanelState.SET }),
        setReady: () => set({ state: PanelState.READY }),
        setRunning: () => set({ state: PanelState.RUNNING }),
        setPaused: () => set({ state: PanelState.PAUSED }),
        setUnset: () => set({ state: PanelState.UNSET })
    }
}))