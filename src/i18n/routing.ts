import { defineRouting } from 'next-intl/routing'
import { avalaibleLocales, defaultLocale } from './locales'

export const routing = defineRouting({
  locales: avalaibleLocales,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed'
});