import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { defaultSlotHotkeys, defaultTimerControlsHotkeys } from './constant'

export interface IHotkeysStore {
    hotkeys: Record<string, string>
    assignHotkey: (id: number, keyBoardKey: string) => any
    getHotkey: (id: number | string) => any
}

const useHotkeyStore = create<IHotkeysStore>()(
    persist(
        (set, get) => ({
            hotkeys: {
                ...defaultSlotHotkeys,
                ...defaultTimerControlsHotkeys,
            },
            assignHotkey: (id: number | string, keyBoardKey: string) => {
                const _id = String(id) // преобразую к строке число
                debugger
                
                set((state) => {
                    const hotkeys = { ...state.hotkeys }
                    
                    for (let [objkey, objvalue] of Object.entries(hotkeys)) {
                        // снять эту клавишу у всех
                        if (objvalue === keyBoardKey) {
                            hotkeys[objkey] = ''
                        }
                        // назначить новому
                        if (objkey === _id) {
                            hotkeys[objkey] = keyBoardKey
                        }
                    }
            
                    return { hotkeys }
                })
            },
            getHotkey: (id: number | string) => get().hotkeys[String(id)]
        }),
        { 
            name: 'hotkeys-storage',
            version: 2,
            partialize: (state) => ({
              hotkeys: state.hotkeys
            }),
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useHotkeyStore