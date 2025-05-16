interface ISlotsHotkeys {
    [key: `position_${number}`]: string
}

interface ITimeControlKey {
    [key: `timeControl_${number}`]: string
}

export const defaultTimeHotkey = 'F9';
export const defaultSlotHotkeys: ISlotsHotkeys = {
    position_1: 'KeyQ',
    position_2: 'KeyW',
    position_3: 'KeyE',
    position_4: 'KeyZ',
    position_5: 'KeyX',
    position_6: 'KeyC'
};

export const defaultControls: ITimeControlKey = {
    timeControl_1: 'KeyB',
    timeControl_2: 'KeyF',
}

export function getTimeControlKey(position: number): string {
    const gotHotkey = localStorage.getItem(`timeControl_${position}`);

    if (gotHotkey !== null) {
        return gotHotkey; 
    }

    const hotkey = defaultControls[`timeControl_${position}`];
    setTimeControlKey(position, hotkey);
    return hotkey;
}

export function setTimeControlKey(position: number, value: string) {
    localStorage.setItem(`timeControl_${position}`, value);
}

export function setPositionHotkey(number: number, string: string): void {
    localStorage.setItem(`position_${number}`, string); 
}

export function getPositionHotkey(number: number): string {
    const gotItem = localStorage.getItem(`position_${number}`);
    
    if (gotItem !== null) {
        return gotItem;
    }

    const hotkey = defaultSlotHotkeys[`position_${number}`];
    setPositionHotkey(number, hotkey)
    return hotkey;
}

export function isUserPlayed(): boolean {
    return !!localStorage.getItem(`userPlayed`);
}

export function setUserPlayed(): void {
    localStorage.setItem(`userPlayed`, 'true');
}

export function getNoteRunTrigger(): string {
    return localStorage.getItem(`noteRunTrigger`) || '';
}

export function setNoteRunTrigger(): string {
    localStorage.setItem(`noteRunTrigger`, 'settedUp');
    return 'settedUp';
}