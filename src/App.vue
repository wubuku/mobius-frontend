<template>
  <router-view />
</template>

<script>
  import { defineComponent, watch } from 'vue';
  import { useStore } from 'vuex';
  import Constans from 'utils/Constants';

  export default defineComponent({
    setup() {
      const { dispatch, getters } = useStore();

      // Switch Theme
      watch(
        () => getters.darkTheme,
        () => document.querySelector('body').classList.toggle('dark', getters.darkTheme),
      );

      try {
        const appConfig = JSON.parse(localStorage.getItem(Constans.APP_CONFIG_KEY));
        dispatch('$setAppConfig', appConfig);
      } catch (e) {
        console.error('No Localstorage');
      }
    },
  });
</script>
