<template>
  <div class="dashboard">
    <template v-if="isLoaded">
      <div class="dashboard__toolbar">
        <asset-selector
          class="dashboard__asset-selector"
          :current-asset="currentAsset"
          @asset-change="setCurrentAsset"
          :scale="scale"
        />

        <div class="dashboard__actions">
          <template v-if="isComponentAllowed('reg.db.issuance-form')">
            <button
              class="app__button-raised dashboard__action"
              @click="isIssuanceFormShown = true"
            >
              <i class="mdi mdi-plus dashboard__plus-icon" />
              {{ 'dashboard.create-issuance-btn' | globalize }}
            </button>
          </template>

          <template v-if="isComponentAllowed('reg.db.transfer-form')">
            <button
              v-if="currentAsset"
              class="app__button-raised dashboard__action"
              @click="isTransferFormShown = true"
            >
              <i class="mdi mdi-send mdi-rotate-315 dashboard__send-icon" />
              <!-- eslint-disable-next-line max-len -->
              {{ 'dashboard.send-asset-lbl' | globalize({ asset: currentAsset }) }}
            </button>
          </template>
          <drawer :is-shown.sync="isTransferFormShown">
            <template slot="heading">
              {{ 'transfer-form.form-heading' | globalize }}
            </template>

            <transfer-form
              @operation-submitted="updateBalancesAndList()"
              :asset-to-transfer="currentAsset"
            />
          </drawer>
        </div>
      </div>

      <template v-if="currentAsset">
        <template v-if="isComponentAllowed('reg.db.chart')">
          <div
            v-if="currentAsset !== defaultQuoteAsset"
            class="dashboard__chart"
          >
            <chart
              :base-asset="currentAsset"
              :quote-asset="defaultQuoteAsset"
            />
          </div>
        </template>

        <template v-if="isComponentAllowed('reg.db.latest-activity')">
          <div class="dashboard__activity">
            <movements-history
              :asset-code="currentAsset"
              :ref="REFS.movementsHistory"
              :latest-activity="true"
            />
          </div>
        </template>
      </template>

      <template v-if="isComponentAllowed('reg.db.issuance-form')">
        <drawer :is-shown.sync="isIssuanceFormShown">
          <template slot="heading">
            {{ 'dashboard.create-issuance-title' | globalize }}
          </template>

          <issuance-form @issuance-created="isIssuanceFormShown = false" />
        </drawer>
      </template>

      <template v-if="isComponentAllowed('reg.db.transfer-form')">
        <drawer :is-shown.sync="isTransferFormShown">
          <template slot="heading">
            {{ 'transfer-form.form-heading' | globalize }}
          </template>

          <transfer-form
            @operation-submitted="(isTransferFormShown = false) ||
              updateBalancesAndList()
            "
            :asset-to-transfer="currentAsset"
          />
        </drawer>
      </template>
    </template>

    <template v-else>
      <loader message-id="dashboard.data-loading" />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'

const REFS = {
  movementsHistory: 'movements-history',
}

export default {
  name: 'dashboard',
  components: {
    'asset-selector': _ => import('@/vue/pages/dashboard/Dashboard.AssetSelector'),
    'chart': _ => import('@/vue/common/chart/Chart'),
    'transfer-form': _ => import('@/vue/forms/TransferForm'),
    'issuance-form': _ => import('@/vue/modules/issuance-form'),
    'movements-history': _ => import('@/vue/modules/movements-history'),
    Loader,
    Drawer,
  },
  data: () => ({
    currentAsset: null,
    isLoaded: false,
    isIssuanceFormShown: false,
    isTransferFormShown: false,
    scale: 'day',
    REFS,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.accountBalances,
      vuexTypes.defaultQuoteAsset,
    ]),
  },
  watch: {
    currentAsset (value) {
      this.$router.push({
        query: { asset: value },
      })
      this.loadBalances()
    },
  },
  async created () {
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setCurrentAsset (value) {
      if (value) {
        this.currentAsset = value.code
      } else {
        const keys = this.accountBalances.map(i => i.asset)
        this.currentAsset =
          keys.find(a => a === this.$route.query.asset) || keys[0] || ''
      }
    },

    updateList () {
      if (!this.$refs[REFS.movementsHistory]) {
        return
      }
      return this.$refs[REFS.movementsHistory].reloadCollectionLoader()
    },

    updateBalancesAndList () {
      return Promise.all([
        this.loadBalances(),
        this.updateList(),
      ])
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.dashboard {
  flex: 1;
}

.dashboard__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: -1rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
  }
}

.dashboard__actions {
  display: flex;
  margin: 1.8rem 1rem 1rem;
}

.dashboard__plus-icon,
.dashboard__send-icon {
  font-size: 1.6rem;
  margin-right: 0.5rem;
}

.dashboard__send-icon {
  margin-top: -0.6rem;
}

.dashboard__asset-selector {
  margin: 1rem;
}

.dashboard__action {
  &:not(:first-child) {
    margin-left: 0.8rem;
  }
}

.dashboard__chart {
  margin-top: -4rem;
}

.dashboard__activity {
  width: 100%;
  margin-top: 2.4rem;
  overflow-x: auto;
}
</style>
