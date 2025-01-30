export function makeSnakeCase(str: string): string {
    return str.trim().split(' ').map(word => word.toLowerCase()).join('_');
}

export function translate(key: string): string {
    return key;
}
  