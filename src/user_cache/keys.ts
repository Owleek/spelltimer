interface ISlotsHotkeys {
    [key: `position_${number}`]: string
}

export const defaultTimeHotkey = 'F9';
export const defaultSlotHotkeys: ISlotsHotkeys = {
    position_1: 'KeyQ',
    position_2: 'KeyW',
    position_3: 'KeyE',
    position_4: 'KeyD',
    position_5: 'KeyF',
    position_6: 'KeyR'
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