export function makeSnakeCase(str: string) {
    return str.trim().split(' ').map(word => word.toLowerCase()).join('_');
}