<template>
  <div class="borrow-layout">
    <div class="borrow-sider">
      <router-link :to="{ name: 'BorrowHome' }">
        <img src="../assets/images/borrow/logo.png" class="logo" />
      </router-link>
      <borrow-menus></borrow-menus>
    </div>
    <div class="borrow-content">
      <div class="borrow-header">
        <div class="gas-box">15 WEI</div>
        <div class="btn primary connect-wallet">{{ $t('borrow.btn.connect') }}</div>
      </div>
      <div class="container">
        <router-view></router-view>
      </div>
      <div class="borrow-footer">
        <router-link :to="{ name: 'Home' }">
          <img class="logo" src="../assets/images/borrow/logo-gray.png" />
        </router-link>
        <div class="footer-right">
          <div class="links">
            <a :href="link.link" v-for="link in links" :key="link.link">{{ link.name }}</a>
          </div>
          <div class="offical-icon">
            <div class="icon gray tele"></div>
            <div class="icon gray twitter"></div>
            <div class="icon gray github"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import BorrowMenus from 'comp/Borrow/Menus.vue';
  import BorrowFooterLinks from 'config/BorrowFooterLinks';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    props: {},
    components: {
      BorrowMenus,
    },
    setup() {
      const { t } = useI18n();

      return {
        links: BorrowFooterLinks(t),
      };
    },
  });
</script>

<style lang="less" scoped>
  .borrow-layout {
    min-height: 100vh;
    display: flex;

    .borrow-sider {
      width: 230px;
      min-height: 100%;
      background: linear-gradient(180deg, #51afc6 0.19%, #019bc1 99.27%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 35px 0 0;

      .logo {
        width: 149px;
      }
    }

    .borrow-content {
      width: 950px;
      min-height: 100vh;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      padding: 0 20px;

      .borrow-header {
        height: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      .container {
        flex: 1;
      }

      .borrow-footer {
        display: flex;
        width: 100%;
        padding: 50px 0;

        .logo {
          width: 190px;
        }

        .footer-right {
          margin-left: auto;
          display: flex;
          justify-content: flex-end;

          .links {
            display: flex;
            align-items: center;
            a {
              color: #9ca5b3;
              margin-right: 30px;
              font-size: 12px;
            }
          }

          .offical-icon {
            width: 130px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-right: 0;
            align-items: center;

            .icon {
              margin: 0;
            }
          }
        }
      }
    }
  }

  .gas-box {
    background: #f7f9fa;
    border-radius: 17.5px;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.85);
    padding: 10px 15px;
    margin-right: 15px;
    display: flex;
    align-items: center;

    &:before {
      content: '';
      display: block;
      width: 15px;
      height: 15px;
      margin-right: 15px;
      background: url(../assets/images/borrow/icon/gas.png) center center / contain no-repeat;
    }
  }

  .connect-wallet {
  }
</style>
