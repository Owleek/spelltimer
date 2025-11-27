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
    if (typeof window === 'undefined') {
        return defaultControls[`timeControl_${position}`];
    }

    const gotHotkey = localStorage.getItem(`timeControl_${position}`);

    if (gotHotkey !== null) {
        return gotHotkey; 
    }

    const hotkey = defaultControls[`timeControl_${position}`];
    setTimeControlKey(position, hotkey);
    return hotkey;
}

export function setTimeControlKey(position: number, value: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`timeControl_${position}`, value);
}

export function setPositionHotkey(number: number, string: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`position_${number}`, string); 
}

export function getPositionHotkey(number: number): string {
    if (typeof window === 'undefined') {
        return defaultSlotHotkeys[`position_${number}`];
    }

    const gotItem = localStorage.getItem(`position_${number}`);
    
    if (gotItem !== null) {
        return gotItem;
    }

    const hotkey = defaultSlotHotkeys[`position_${number}`];
    setPositionHotkey(number, hotkey)
    return hotkey;
}

export function isUserPlayed(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(`userPlayed`);
}

export function setUserPlayed(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`userPlayed`, 'true');
}

export function getNotificationOfRunning(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`runningNotification`) || '';
}

export function setNotificationOfRunning(): string {
    if (typeof window === 'undefined') return '1';
    localStorage.setItem(`runningNotification`, '1');
    return '1';
}

export function getLocale(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('locale') || '';
}

export function setLocale(locale: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('locale', locale);
}

