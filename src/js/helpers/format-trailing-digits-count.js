import { store } from '@/vuex/index'
import { vuexTypes } from '@/vuex/types'
import config from '@/config'

export function formatTrailingDigitsCount ({ currency, value }) {
  const trailingDigit = store.getters[vuexTypes.assets]
    .find(asset => asset.code === currency)
    .trailingDigitsCount || config.DECIMAL_POINTS
  const newValue = value.toFixed(trailingDigit)
  return { value: newValue, currency }
}
