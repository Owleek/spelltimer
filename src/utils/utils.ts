export function makeSnakeCase(str: string): string {
    return str.trim().split(' ').map(word => word.toLowerCase()).join('_');
}

export function translate(key: string): string {
    return key;
}

export function createArrayFromNumber(number: number): Array<number> {
    return Array.from({length: number}, (_, index) => index + 1);
}

export function toSafeInteger(input: string): number | null {
    const parsed = Number(input);

    if (
        isNaN(parsed) ||             
        !isFinite(parsed) ||         
        parsed % 1 !== 0 ||         
        parsed <= 0 ||              
        parsed > 999         
    ) {
        return null
    }

    return parsed;
}