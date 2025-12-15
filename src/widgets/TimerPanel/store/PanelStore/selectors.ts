import { usePanelStore } from './state'
import { IPanelStore } from './types'

export const usePanelState = () => {
    return usePanelStore((state: IPanelStore) => state.state)
}

export const useSetSet = () => {
    return usePanelStore((state: IPanelStore) => state.actions.setSet)
}

export const useSetReady = () => {
    return usePanelStore((state: IPanelStore) => state.actions.setReady)
}

export const useSetRunning = () => {
    return usePanelStore((state: IPanelStore) => state.actions.setRunning)
}

export const useSetPaused = () => {
    return usePanelStore((state: IPanelStore) => state.actions.setPaused)
}

export const useSetUnset = () => {
    return usePanelStore((state: IPanelStore) => state.actions.setUnset)
}