export function makeSnakeCase(str: string): string {
    return str.trim().split(' ').map(word => word.toLowerCase()).join('_');
}

export function translate(key: string): string {
    return key;
}

export function createArrayFromNumber(number: number): Array<number> {
    return Array.from({length: number}, (_, index) => index + 1);
}