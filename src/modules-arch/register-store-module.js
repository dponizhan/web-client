import { store } from '@/vuex/index'
import _isObject from 'lodash/isObject'

function delay (ms) { // TODO: should not be here
  /* eslint-disable-next-line promise/avoid-new */
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Registers store module dynamically
 *
 * @param {Promise|Object} arg - Accepts a store module object with
 * name, namespaced: true, and state properties
 */
export async function registerStoreModule (arg) {
  let extracted
  console.log(1)
  await delay(5000)
  if (arg instanceof Promise) {
    extracted = await extractStoreModuleFromPromise(arg)
  } else {
    extracted = extractStoreModule(arg)
  }
  console.log(2)

  const { name: namespace, ...storeModule } = extracted

  store.registerModule(namespace, storeModule)
}

async function extractStoreModuleFromPromise (promise) {
  return extractStoreModule(await promise)
}

function extractStoreModule (imported) {
  const obj = Object.values(imported)
    .find(item => _isObject(item) && item.namespaced && item.name && item.state)

  if (!obj) {
    throw new Error('registerStoreModule: not a store module provided')
  }

  return obj
}
