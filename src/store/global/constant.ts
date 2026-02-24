import { ITimerData } from '../../data/data'

export const COUNT_OF_SLOTS = 6

// ---------> ГОРЯЧИЕ КЛАВИШИ

// ---> Дефолтные значения горячих клавиш слотов для предопределенного количечества
export const presetSlotHotkeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyZ', 'KeyX', 'KeyC']

export type ISlotIdsRecord = Record<string, string>
export const defaultSlotHotkeys: ISlotIdsRecord = {} as ISlotIdsRecord

Array.from({length: COUNT_OF_SLOTS}).forEach((_, index) => {
    // наполняю объект defaultSlotHotkeys дефолтными значениями по порядку, для 1: 'KeyQ', 2: 'KeyW' и тд, если больше 6 то пустое значение, можно дополнить по желанию
    defaultSlotHotkeys[`${index + 1}`] = presetSlotHotkeys[index + 1] || ''
})


// ---> Дефолтные значения горячих клавиш контроллеров таймера
export interface ITimerControlHotkeys {
    forward: string
    backward: string
    togglePlay: string
}

export const defaultTimerControlsHotkeys: ITimerControlHotkeys = {
    forward: 'KeyF',
    backward: 'KeyB',
    togglePlay: 'F9'
}


// ---------> СЛОТЫ

export interface IEmptySlot {
    position: string
    hotkey: string
}

export type ISlot = ITimerData | IEmptySlot