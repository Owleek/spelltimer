export const MAX_COUNT_SLOTS = 6


// ---> Дефолтные значения горячих клавиш слотов для предопределенного количечества
export const presetSlotHotkeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyZ', 'KeyX', 'KeyC']

export type ISlotIdsRecord = Record<`${number}`, string>
export const defaultSlotHotkeys: ISlotIdsRecord = {} as ISlotIdsRecord

Array.from({length: MAX_COUNT_SLOTS}).forEach((_, index) => {
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