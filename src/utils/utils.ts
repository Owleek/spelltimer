import { getLocale } from "../user_cache/keys";


export function makeSnakeCase(str: string): string {
    return str.trim().split(' ').map(word => word.toLowerCase()).join('_');
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

export const detectLocale = (): string => {
  const saved = getLocale();
  if (saved) return saved;

  // Простейшая версия синхронной детекции:
  const browserLang = navigator.language;
  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("ar")) return "ar";
  return "en";
};

export function translateText(dictionary: Record<string, string>, text: string) {
  return dictionary[text] || text;
}