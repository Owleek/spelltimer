import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ar', 'de', 'en', 'es', 'it', 'ru', 'zh'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed'
});