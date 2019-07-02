<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-if="getModule().canRenderSubmodule(VerificationPageModule)"
          :to="vueRoutes.verification"
        >
          <span>{{ verificationTabId | globalize }}</span>
        </router-link>
        <router-link
          v-if="getModule().canRenderSubmodule(SecurityPageModule)"
          :to="vueRoutes.security"
        >
          <span>{{ 'settings-page.security-tab' | globalize }}</span>
        </router-link>
        <language-select />
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import LanguageSelect from '@/vue/common/LanguageSelect'

import { vueRoutes } from '@/vue-router/routes'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'

export default {
  name: 'settings',
  components: {
    TopBar,
    LanguageSelect,
  },
  data: _ => ({
    vueRoutes,
    VerificationPageModule,
    SecurityPageModule,
  }),
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
    }),
    verificationTabId () {
      if (this.kycState === REQUEST_STATES_STR.approved) {
        return 'settings-page.my-account-tab'
      } else {
        return 'settings-page.verification-tab'
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
