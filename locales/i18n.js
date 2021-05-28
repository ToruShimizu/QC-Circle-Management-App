// NOTE: Doc => https://i18n.nuxtjs.org/
import { i18nJa } from './ja'

export const i18nOptions = {
  locales: ['ja'],
  defaultLocale: 'ja',
  vueI18n: {
    fallbackLocale: 'ja',
    messages: {
      ja: i18nJa
    }
  },
  strategy: 'no_prefix'
}
