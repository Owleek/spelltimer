export const localeDictionary = {
  ar: 'العربية',
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  zh: '中文'
} as const;

export const avalaibleLocales = Object.keys(localeDictionary);

export const defaultLocale = 'ru';