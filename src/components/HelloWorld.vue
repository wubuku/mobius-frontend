<template>
  <p>{{ t('hello') }}</p>
  {{ msg }}
  <div class="locale-changer">
    {{ i18n.locale }}
    <select v-model="i18n.locale" @change="languageChange">
      <option v-for="locale in i18n.availableLocales" :key="locale" :value="locale">
        {{ locale }}
      </option>
    </select>
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: String,
    },
    setup() {
      const { t } = useI18n();
      const { $i18n } = getCurrentInstance().appContext.config.globalProperties;

      const languageChange = () => {
        window.localStorage.setItem('locale', $i18n.locale);
      };
      return { t, i18n: $i18n, languageChange };
    },
  });
</script>
