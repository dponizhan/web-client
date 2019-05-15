<template>
  <div class="movements">
    <template v-if="isComponentAllowed('reg.mv.movements-top-bar')">
      <movements-top-bar
        @asset-updated="updateAsset"
        @movements-update-required="updateList"
      />
    </template>

    <template v-if="isComponentAllowed('reg.mv.movements-top-bar-reit')">
      <movements-top-bar-reit
        :config="movementsTopBarReitConfig"
        @asset-updated="updateAsset"
        @withdrawn="withdrawalFiatModuleWithdrawn"
        @deposited="depositFiatModuleDeposited"
        @redeemed="redeemModuleSubmitted"
      />
    </template>

    <template v-if="isComponentAllowed('reg.mv.movements-history')">
      <movements-history
        v-if="asset.code"
        :asset-code="asset.code"
        :key="`movements-history-state-${historyState}`"
      />

      <no-data-message
        v-else-if="isLoadFailed"
        icon-name="trending-up"
        :title="'op-pages.no-data-title' | globalize"
        :message="'op-pages.no-data-msg' | globalize"
      />

      <loader
        v-else
        message-id="op-pages.assets-loading-msg"
      />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import config from '@/config'

export default {
  name: 'movements-page',
  components: {
    Loader,
    NoDataMessage,
    'movements-history': _ => import('@/vue/modules/movements-history'),
    'movements-top-bar': _ => import('@modules/movements-top-bar'),
    // TODO: movements-top-bar-reit
    'movements-top-bar-reit': _ => import('@modules/movements-top-bar-reit'),
  },

  data: _ => ({
    asset: {},
    isLoadFailed: false,
    movementsTopBarReitConfig: {
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      maxAmount: config.MAX_AMOUNT,
      decimalPoints: config.DECIMAL_POINTS,
    },
    historyState: 0,
  }),

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    withdrawalFiatModuleWithdrawn () {
      this.updateList()
    },

    depositFiatModuleDeposited () {
      this.updateList()
    },

    redeemModuleSubmitted () {
      this.updateList()
    },

    updateList () {
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
</style>
