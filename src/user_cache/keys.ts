interface ISlotsHotkeys {
    [key: `position_${number}`]: string
}

export const defaultTimeHotkey = 'F9';
export const defaultSlotHotkeys: ISlotsHotkeys = {
    position_1: 'Q',
    position_2: 'W',
    position_3: 'E',
    position_4: 'D',
    position_5: 'F',
    position_6: 'R'
};

export function setTimeHotkey(string: string): void {
    localStorage.setItem(`timeHotkey`, string);
}

export function getTimeHotkey(): string {
    const gotHotkey = localStorage.getItem(`timeHotkey`);

    if (gotHotkey !== null) {
        return gotHotkey; 
    }

    setTimeHotkey(defaultTimeHotkey);
    return defaultTimeHotkey;
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