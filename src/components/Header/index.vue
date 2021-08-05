<template>
  <div class="m-header">
    <div class="m-header-container">
      <img src="../../assets/images/logo.png" class="m-logo" alt="" />
      <!-- <theme-switch></theme-switch> -->
      <a-menu
        class="m-menu"
        :inlineIndent="10"
        v-model:selectedKeys="current"
        mode="horizontal"
        @click="menuClick"
      >
        <a-menu-item key="Home">
          {{ t('menus.index') }}
        </a-menu-item>
        <a-menu-item key="Market">
          {{ t('menus.market') }}
        </a-menu-item>
        <a-sub-menu>
          <template #title>{{ t('menus.governance') }}</template>
          <a-menu-item-group title="Item 1">
            <a-menu-item key="setting:1">Option 1</a-menu-item>
            <a-menu-item key="setting:2">Option 2</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group title="Item 2">
            <a-menu-item key="setting:3">Option 3</a-menu-item>
            <a-menu-item key="setting:4">Option 4</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-menu-item key="Docs">
          <!-- <a href="https://antdv.com" target="_blank" rel="noopener noreferrer"> -->
          {{ t('menus.docs') }}
          <!-- </a> -->
        </a-menu-item>
        <a-menu-item key="Community">
          {{ t('menus.community') }}
        </a-menu-item>
      </a-menu>
      <div class="btn app-btn">
        {{ t('btn.app') }}
      </div>
      <!-- <m-account class="m-account"></m-account> -->
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  // import MAccount from 'comp/Header/Account';
  // import ThemeSwitch from 'comp/ThemeSwitch';
  export default defineComponent({
    props: {},
    components: {
      // MAccount,
      // ThemeSwitch,
    },
    setup() {
      const { t } = useI18n();
      const route = useRoute();
      const router = useRouter();
      const APP_NAME = process.env.VUE_APP_NAME;
      const current = ref(['Home']);

      watch(
        () => route,
        (route) => {
          console.log(route);
        },
      );

      // set current route
      current.value = [route.name];

      const menuClick = ({ key }) => {
        router.push({
          name: key,
        });
      };

      return {
        APP_NAME,
        current,
        t,
        menuClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  .m-header {
    height: 125px;
    display: flex;
    justify-content: center;

    .m-header-container {
      height: 100%;
      max-width: 1100px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;

      .m-logo {
        height: 27px;
        margin-right: 125px;
      }

      .m-menu {
        flex: 1;
        background: transparent;
        font-size: 16px;
        line-height: 21px;
      }

      .m-account {
        margin-left: auto;
      }
    }
  }

  .app-btn {
    flex-shrink: 0;
    border-radius: 50px;
    font-size: 18px;
    line-height: 21px;
    color: #498a9a;
    padding: 13px 30px 13px 60px;
    background: url('../../assets/images/icon/borrow.png') 30px center / 20px no-repeat #e2faff;
  }
</style>
