export const localeDictionary = {
  ar: 'العربية',
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
  zh: '中文'
} as const;

export const avalaibleLocales = Object.keys(localeDictionary);

export const defaultLocale = 'ru';