import { create } from 'zustand'
import { COUNT_OF_SLOTS, defaultSlotHotkeys, ISlot } from './constant'
import { persist, createJSONStorage } from 'zustand/middleware'

const slotStores = new Map<string, ReturnType<typeof createSlotStore>>()

const createSlotStore = (id: string, defaultHotkey = '') => create<ISlot>(
    // @ts-ignore
    persist(
        (set, get) => ({ 
            position: id, 
            hotkey: defaultHotkey 
        }),
        { 
            name: `slot_${id}`,
            version: 2,
            partialize: (state) => ({
              position: state.position,
              hotkey: state.hotkey
            }),
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

Array.from({length: COUNT_OF_SLOTS}).forEach((_, idx) => {
    const stringId = String(idx + 1)
    const defaultHotkey = defaultSlotHotkeys[stringId] || ''
    slotStores.set(stringId, createSlotStore(stringId, defaultHotkey))
})

const getSlotStore = (id: string) => slotStores.get(id)