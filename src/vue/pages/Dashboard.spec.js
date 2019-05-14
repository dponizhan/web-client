import Dashboard from './Dashboard'

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import accountModule from '@/vuex/account.module'
import { vuexTypes } from '@/vuex'
import { ASSET_POLICIES } from '@tokend/js-sdk'

Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.filter('globalize', globalize)

describe('Dashboard component', () => {
  let wrapper
  let store

  const mockedAccountBalances = [
    {
      asset: 'BTC',
      balance: '1',
      assetDetails: {
        code: 'BTC',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
        ],
      },
    },
    {
      asset: 'USD',
      balance: '3',
      assetDetails: {
        code: 'USD',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
          { value: ASSET_POLICIES.statsQuoteAsset },
        ],
      },
    },
    {
      asset: 'ETH',
      balance: '0',
      assetDetails: {
        code: 'ETH',
        policies: [
          { value: ASSET_POLICIES.baseAsset },
        ],
      },
    },
  ]

  function mountComponentWithSpecifiedAccountBalances (mockedAccountBalances) {
    sinon.stub(accountModule.getters, vuexTypes.accountBalances)
      .returns(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions,
    })
    const router = new VueRouter({
      mode: 'history',
      routes: [],
    })

    sinon.stub(Dashboard, 'created').resolves()
    wrapper = shallowMount(Dashboard, {
      store,
      localVue,
      router,
    })
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('setCurrentAsset()', () => {
    it('set currentAsset as passed value', () => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
      wrapper.vm.setCurrentAsset({ code: 'BTC' })

      expect(wrapper.vm.currentAsset).to.equal('BTC')
    })

    describe('set default currentAsset =>', () => {
      it('set router query asset if accountBalances has one', () => {
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
        wrapper.vm.$router.push({
          query: { asset: 'ETH' },
        })

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('ETH')
      })

      it('set first asset code in accountBalances list route query asset does not exists', () => {
        const mockedAccountBalances = [
          {
            asset: 'BTC',
            balance: '1',
            assetDetails: {
              policies: [
                { value: ASSET_POLICIES.transferable },
                { value: ASSET_POLICIES.baseAsset },
              ],
            },
          },
        ]
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('BTC')
      })

      it('set empty string if accountBalances is empty', () => {
        const mockedAccountBalances = []
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('')
      })
    })
  })

  describe('watchers', () => {
    beforeEach(() => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
    })

    describe('isIssuanceFormShown()', () => {
      it('apply "true" value', async () => {
        wrapper.vm.isIssuanceFormShown = true

        await localVue.nextTick()

        expect(wrapper.vm.isIssuanceFormShown).to.be.true
      })

      it('apply "false" value', async () => {
        wrapper.vm.isIssuanceFormShown = false

        await localVue.nextTick()

        expect(wrapper.vm.isIssuanceFormShown).to.be.false
      })
    })

    describe('isTransferFormShown()', () => {
      it('apply "true" value', async () => {
        wrapper.vm.isTransferFormShown = true

        await localVue.nextTick()

        expect(wrapper.vm.isTransferFormShown).to.be.true
      })

      it('apply "false" value', async () => {
        wrapper.vm.isTransferFormShown = false

        await localVue.nextTick()

        expect(wrapper.vm.isTransferFormShown).to.be.false
      })
    })
  })
})
