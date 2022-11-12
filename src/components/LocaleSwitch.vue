<template>
  <a-dropdown placement="bottomRight" trigger="hover">
    <div class="dropdown-placeholder">
      <img :src="dropdownFlag" class="flag" />
    </div>
    <template #overlay>
      <a-menu @click="({ key }) => switchLanguage(key)">
        <a-menu-item key="en">
          <img src="../assets/locales/en.svg" class="flag" />
        </a-menu-item>
        <a-menu-item key="zh">
          <img src="../assets/locales/zh.svg" class="flag" />
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
  import { computed, getCurrentInstance } from 'vue';
  const { $i18n: i18n } = getCurrentInstance().appContext.config.globalProperties;

  const dropdownFlag = computed(() => {
    const lang = i18n.locale;
    return require(`../assets/locales/${lang}.svg`);
  });

  const switchLanguage = (locale) => {
    i18n.locale = locale;
    window.localStorage.setItem('locale', i18n.locale);
  };
</script>

<style lang="less" scoped>
  .dropdown-placeholder {
    width: 24px;
    height: 34px;
    font-size: 14px;
  }

  .flag {
    width: 24px;
    height: 24px;
    margin: 5px 0;
    cursor: pointer;
  }
</style>
