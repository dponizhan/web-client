<template>
  <div>
    <select-field
      :value="language"
      @input="setLanguage"
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
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import { LANGUAGES } from '@/i18n/languages'
export default {
  name: 'language-select',
  components: {
    SelectField,
  },
  data () {
    return {
      LANGUAGES,
      language: LANGUAGES[0],
    }
  },
  created () {
    if (localStorage.language) {
      this.language = localStorage.language
    }
  },
  methods: {
    setLanguage (value) {
      this.language = value
      localStorage.language = this.language
      location.reload()
    },
  },
}
</script>
