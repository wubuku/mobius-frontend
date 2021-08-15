<template>
  <div class="m-header">
    <div class="center-container m-header-container">
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
          {{ $t('official.menus.index') }}
        </a-menu-item>
        <a-menu-item key="Market">
          {{ $t('official.menus.market') }}
        </a-menu-item>
        <a-menu-item key="Governance">
          {{ $t('official.menus.governance') }}
        </a-menu-item>
        <a-sub-menu key="Docs">
          <template #title>{{ $t('official.menus.docs') }}</template>
          <a-menu-item-group title="Item 1">
            <a-menu-item key="setting:1">Option 1</a-menu-item>
            <a-menu-item key="setting:2">Option 2</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group title="Item 2">
            <a-menu-item key="setting:3">Option 3</a-menu-item>
            <a-menu-item key="setting:4">Option 4</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-menu-item key="Community">
          {{ $t('official.menus.community') }}
        </a-menu-item>
      </a-menu>
      <div class="btn app-btn" @click="goBorrow">
        {{ $t('official.btn.app') }}
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

      const goBorrow = () => {
        router.push({
          name: 'BorrowHome',
        });
      };

      return {
        APP_NAME,
        current,
        t,

        menuClick,
        goBorrow,
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
      display: flex;
      align-items: center;
      padding: 0 10px;

      .m-logo {
        height: 27px;
        margin-right: 65px;
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
    background: url('../../assets/images/icon/app.png') 30px center / 20px no-repeat #e2faff;
  }
</style>
