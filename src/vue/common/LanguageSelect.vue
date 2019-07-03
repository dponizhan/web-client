<template>
  <div>
    <select-field
      v-if="!isShowConfirmation"
      :value="language"
      @input="selectLanguage"
      class="app__select app__select--no-border"
    >
      <option
        v-for="lang in LANGUAGES"
        :key="lang"
        :value="lang"
      >
        {{ lang }}
      </option>
    </select-field>
    <template v-else>
      <form-confirmation
        :message-id="'language-select.experimental-feature' | globalize"
        @ok="setLanguage()"
        @cancel="isShowConfirmation = false"
      />
    </template>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import FormConfirmation from './FormConfirmation'

import { LANGUAGES } from '@/i18n/languages'
export default {
  name: 'language-select',
  components: {
    SelectField,
    FormConfirmation,
  },
  data () {
    return {
      LANGUAGES,
      language: LANGUAGES[0],
      temporaryLanguage: '',
      isShowConfirmation: false,
    }
  },
  created () {
    if (localStorage.language) {
      this.language = localStorage.language
    }
  },
  methods: {
    setLanguage () {
      this.language = this.temporaryLanguage
      localStorage.language = this.language
      location.reload()
      this.isShowConfirmation = false
    },
    selectLanguage (value) {
      if (value === 'ru') {
        this.temporaryLanguage = value
        this.isShowConfirmation = true
      } else {
        this.language = value
        localStorage.language = this.language
        location.reload()
      }
    },
  },
}
</script>
