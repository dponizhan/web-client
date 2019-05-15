import { PageModuleDescriptor } from './page-module-descriptor'
import { SchemeRegistry } from './scheme-registry'
import { vuexTypes } from '@/vuex/types'

/**
 * Represents module set to be used by the application.
 */
export class ModuleScheme {
  /**
   * Build the scheme
   *
   * @param {Object} scheme
   *
   * @param {String} scheme.appLogoUrl
   * URL of the image that should be displayed as an application logo
   *
   * @param {Function} scheme.importEnLocaleFile
   * Example: _ => import('./path').
   *
   * @param {PageModuleDescriptor[]} scheme.pages
   */
  constructor (scheme) {
    this._validateRawScheme(scheme)

    this._rawScheme = scheme
    this._appLogoUrl = scheme.appLogoUrl
    this._pages = scheme.pages
    this._importEnLocaleFile = scheme.importEnLocaleFile

    // To validate the whole bunch of modules for compatibility
    this._cache = this._createCache()
    this._validateCache()
  }

  get appLogoUrl () { return this._appLogoUrl }
  get pages () { return this._pages }
  get cache () { return this._cache }
  get importEnLocaleFile () { return this._importEnLocaleFile }

  _validateRawScheme (scheme) {
    if (!scheme.pages) {
      throw new Error('ModuleScheme: no scheme.pages provided!')
    }

    if (!Array.isArray(scheme.pages)) {
      throw new Error('ModuleScheme: scheme.pages should be an Array!')
    }

    if (!scheme.pages.every(item => item instanceof PageModuleDescriptor)) {
      throw new Error('ModuleScheme: scheme.pages should contain only PageModuleDescriptor instances!')
    }
  }

  _createCache () {
    const cache = this._flattenDeep(this._rawScheme.pages)
    return cache
  }

  _validateCache () {
    for (const item of this.cache) {
      item.validateDependencies(this.cache)
      item.validateCompatibility(this.cache)
    }
  }

  _flattenDeep (modules = []) {
    const result = []
    for (const item of modules) {
      result.push(item)
      if (item.submodules) {
        result.push(...this._flattenDeep(item.submodules))
      }
    }
    return result
  }

  install (Vue) {
    Vue.prototype.getModule = function () {
      return SchemeRegistry.current.cache
        .find(item => item.createdComponentUid === this._uid)
    }

    Vue.prototype.isComponentAllowed = function (path) {
      // TODO: refactor
      function findFeature (routes, criteriaCb) {
        let found
        for (const item of routes) {
          found = ((item.meta || {}).featureWhiteList || []).find(criteriaCb)

          if (!found && item.children) {
            found = findFeature(item.children, criteriaCb)
          } else if (found) {
            break
          }
        }
        return found
      }

      const isAccessibleFeature = (feature) => {
        const isAccountCorporate =
          this.$store.getters[vuexTypes.isAccountCorporate]
        if (((feature || {}).options || {}).isCorporateOnly) {
          return isAccountCorporate
        }
        return true
      }

      try {
        const res = findFeature(
          this.$router.options.routes,
          item => item.name === path && isAccessibleFeature(item),
        )
        return Boolean(res)
      } catch (error) {
        console.error(error)
        return false
      }
    }

    Vue.mixin({
      async created () {
        const regFn = this.$options.registerStoreModule
        if (regFn) {
          const wpModule = await regFn()

          const storeModule = Object.values(wpModule)
            .find(item => item.name && item.namespaced)

          if (!this.$store.state[storeModule.name]) {
            this.$store.registerModule(storeModule.name, storeModule)
          }

          console.log('registered')
        }
      },
    })

    // Vue.prototype.registerStoreModule = function ({ name, ...storeModule }) {
    //   this.$store.registerModule(name, storeModule)
    // }
  }

  findModuleByPath (path) {
    return this.cache
      .find(item => item.routerEntry && item.routerEntry.path === path)
  }
}
