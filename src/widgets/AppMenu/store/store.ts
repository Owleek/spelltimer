import { create } from 'zustand'
import { IStore } from './type'

export const useStore = create<IStore>((set) => ({
    isVisible: false,
    actions: {
        setVisible: (arg: boolean) => set({isVisible: arg})
    }
}))