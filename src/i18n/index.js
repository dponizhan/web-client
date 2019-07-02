import moment from 'moment-timezone'

import _isObject from 'lodash/isObject'
import _merge from 'lodash/merge'

import { MathUtil } from '@/js/utils'
import { LANGUAGES } from './languages'

export function buildI18n (language, ...localesJson) {
  let result
  switch (language) {
    case 'en':
      result = _merge(
        require(`./en`),
        require(`./en.terms`),
        require(`./en.pre-issuance-guide`),
        ...localesJson
      )
      break
    case 'ru':
      result = _merge(
        require(`./ru`),
        require(`./ru.terms`),
        require(`./ru.pre-issuance-guide`),
        ...localesJson
      )
      break
    default:
      throw new Error('Locale not found')
  }

  return result
}

export function buildI18nOptions (language, i18n) {
  return {
    lng: language,
    debug: false,
    resources: {
      en: {
        translation: {
          ...i18n.translations,
        },
      },
      ru: {
        translation: {
          ...i18n.translations,
        },
      },
    },
    whitelist: ['en', 'ru'],
    // set to true if you need en-US/en-UK lng's:
    nonExplicitWhitelist: false,
    interpolation: {
      format: (param, format) => {
        switch (format.toLowerCase()) {
          case 'date':
            return moment(param).format(i18n.config.date.presets.datetime)
          case 'dmy':
            return moment(param).format(i18n.config.date.presets.dmy)
          case 'dmyt':
            return moment(param).format(i18n.config.date.presets.dmyt)
          case 'calendar':
            return moment(param).calendar(null, i18n.config.date.calendar)
          case 'calendar-inline':
            return moment(param)
              .calendar(null, i18n.config.date.calendarInline)
          case 'money':
            const value = (_isObject(param) ? param.value : param) || '0'
            const defaultFormat = i18n.config.number.formats.amounts.default

            const result = MathUtil.format(value, defaultFormat)
            return param.currency ? result.concat(' ', param.currency) : result
          case 'number':
            return MathUtil.format(param, i18n.config.number.formats.default)
          case 'integer':
            return MathUtil.format(param, i18n.config.number.formats.integer)
          case 'percent':
            const convertedPercent = MathUtil.multiply(param, 100)
            return MathUtil.format(
              convertedPercent, i18n.config.number.formats.percent
            )
          default:
            console.warn(`Unknown format: ${format}, skipping..`)
            return param
        }
      },
    },
  }
}

let lang = LANGUAGES[0]
if (localStorage.language) {
  lang = localStorage.language
} else {
  let language = window.navigator ? (window.navigator.language ||
    window.navigator.systemLanguage ||
    window.navigator.userLanguage) : LANGUAGES[0]
  language = language.substr(0, 2).toLowerCase()
  if (LANGUAGES.find(item => item === language)) {
    lang = language
    localStorage.language = language
  } else {
    localStorage.language = lang
  }
}
export const i18nOptions = buildI18nOptions(
  lang,
  buildI18n(lang)
)

export function mergeIntoI18nOptions (...localesJson) {
  Object.assign(
    i18nOptions,
    buildI18nOptions(
      lang,
      buildI18n(lang, ...localesJson)
    )
  )
}
