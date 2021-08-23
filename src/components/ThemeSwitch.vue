<template>
  <div class="theme-switch">
    <v-icon
      :icon="getters.darkTheme ? THEME_STATUS.SUN : THEME_STATUS.MOON"
      @click="setDarkTheme"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useStore } from 'vuex';

  export default defineComponent({
    setup() {
      const THEME_STATUS = {
        SUN: 'sun',
        MOON: 'moon',
      };

      const { dispatch, getters } = useStore();
      const setDarkTheme = () => {
        dispatch('$setDarkTheme', !getters.darkTheme);
      };

      return {
        THEME_STATUS,
        setDarkTheme,
        getters,
      };
    },
  });
</script>

<style lang="less" scoped>
  .theme-switch {
    padding: 10px;
    border-radius: 10px;
    background-color: var(--themeColor);
    user-select: none;

    svg {
      cursor: pointer;
      :deep(path) {
        fill: var(--color);
      }
    }
  }
</style>
