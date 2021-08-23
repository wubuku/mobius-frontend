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
        <connect-btn></connect-btn>
      </div>
      <div class="container">
        <router-view></router-view>
      </div>
      <div class="borrow-footer">
        <a-switch class="theme-switch" v-model:checked="theme" />
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
  import { defineComponent, inject, onBeforeMount, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';

  import BorrowFooterLinks from 'config/BorrowFooterLinks';
  import useUser from 'uses/useUser';
  import useTransaction from 'uses/useTransaction';

  import BorrowMenus from 'comp/Borrow/Menus.vue';
  import ConnectBtn from 'comp/Borrow/ConnectBtn';

  import useToken from 'uses/useToken';
  // import { getAllUncheckedTxns, doneTxn } from 'utils';
  import { GetPersonalAssets, GetTransactionStatus } from 'service/InitService';

  import { toTokenString } from 'utils';

  export default defineComponent({
    props: {},
    components: {
      BorrowMenus,
      ConnectBtn,
    },
    setup() {
      const { t } = useI18n();
      const theme = ref(false);
      const emitter = inject('emitter');
      const { accountHash, setPersonalAssets } = useUser();
      const { tokenList, getTokenList } = useToken();
      const { startTransactionCheck } = useTransaction();
      const store = useStore();
      const emptyData = ref(false);

      startTransactionCheck();

      window.starcoin.on('tx:confirmed', () => {
        console.log(...arguments);
      });

      watch(accountHash, () => {
        getPersonalAssets();
      });

      watch(theme, () => {
        if (theme.value) {
          window.localStorage.setItem('theme', 'dark');
          document.querySelector('.borrow-layout').classList.add('dark');
        } else {
          window.localStorage.removeItem('theme');
          document.querySelector('.borrow-layout').classList.remove('dark');
        }
      });

      // hook
      onMounted(() => {
        theme.value = window.localStorage.getItem('theme') === 'dark';

        getTokenList();
        getPersonalAssets();
      });

      // method
      const getPersonalAssets = () => {
        if (!accountHash.value) return;

        GetPersonalAssets(accountHash.value)
          .then((res) => {
            if (!res) {
              emptyData.value = !res;
            } else {
              // 前面是固定格式
              setPersonalAssets(res.json.items.vec[0][0] || []);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };

      emitter.on('getPersonalAsset', () => getPersonalAssets());

      return {
        links: BorrowFooterLinks(t),
        theme,
      };
    },
  });
</script>

<style lang="less" scoped>
  .borrow-layout {
    min-height: 100vh;
    display: flex;
    transition: background-color 0.5s, color 0.5s;

    .borrow-sider {
      width: 230px;
      min-height: 100%;
      background: linear-gradient(180deg, #51afc6 0.19%, #019bc1 99.27%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 35px 15px 0;

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
        display: flex;
        flex-direction: column;
      }

      .borrow-footer {
        display: flex;
        width: 100%;
        padding: 50px 0;
        position: relative;

        .theme-switch {
          position: absolute;
          right: 0;
          top: 0;
        }

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

<style lang="less">
  .borrow-layout {
    &.dark {
      background-color: #0b1026;
      color: #fff;

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: #fff;
      }

      .table-title {
        color: #fff;
      }

      .label-number .num {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: inset 0px 0px 6px rgba(255, 255, 255, 0.08);
      }
    }
  }
</style>
