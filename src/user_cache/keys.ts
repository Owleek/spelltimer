export const TIMEHOTKEY = 'timeHotkey';

interface ITimeHotkey {
    [TIMEHOTKEY]: string
}

interface ISlotsHotkeys {
    [key: `position_${number}`]: string
}

interface IHotkeys extends ITimeHotkey, ISlotsHotkeys {}

export const defaultTimeHotkey = {
    timeHotkey: 'F9'
}

export const defaultSlotHotkeys: ISlotsHotkeys = {
    position_1: 'Q',
    position_2: 'W',
    position_3: 'E',
    position_4: 'D',
    position_5: 'F',
    position_6: 'R'
};

export const defaultHotkeys: IHotkeys = {
    ...defaultTimeHotkey,
    ...defaultSlotHotkeys
}

export function hotkeysIsEmpty(): boolean {
    return !!Object.keys(defaultHotkeys).every(key => !localStorage.getItem(key));
}

export function setDefaultHotkeys(): void {
    Object.entries(defaultHotkeys).forEach(([key, value]) => localStorage.setItem(`${key}`, value));
}

export function getTimeHotkey(): string {
    return localStorage.getItem(`${TIMEHOTKEY}`) || '';
}

export function setTimeHotkey(string: string): void {
    localStorage.setItem(`${TIMEHOTKEY}`, string);
}

export function getPositionHotkey(number: number): string {
    return localStorage.getItem(`position_${number}`) || ''; 
}

export function setPositionHotkey(number: number, string: string): void {
    localStorage.setItem(`position_${number}`, string); 
}

export default defaultHotkeys;