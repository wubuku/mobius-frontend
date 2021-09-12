<template>
  <div v-if="accountHash" class="btn primary account-btn">
    {{ btnText }}
    <!-- <div class="btn still primary token-btn">0.000000</div> -->
  </div>
  <div v-else class="btn primary account-btn" @click="connectWallet">
    {{ $t('borrow.btn.connect') }}
  </div>
</template>

<script>
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    ref,
    watch,
  } from 'vue';
  import StarMaskOnboarding from '@starcoin/starmask-onboarding';
  import { shortCutOfAccountHash } from 'utils';
  import { useStore } from 'vuex';
  import useUser from 'uses/useUser';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    props: {},
    setup() {
      const store = useStore();
      const { accountHash } = useUser();
      const { t } = useI18n();
      const $message = inject('$message');

      const CONNECT_TEXT = t('borrow.btn.connect');
      const LS_KEY_NAME = 'connectorId';
      const btnText = ref(CONNECT_TEXT);
      const onBoarding = new StarMaskOnboarding();
      const emitter = inject('emitter');

      const isStarMaskInstalled = computed(() => {
        return StarMaskOnboarding.isStarMaskInstalled();
      });

      //hook
      onBeforeMount(() => {
        if (window.starcoin && window.starcoin.on) {
          window.starcoin.on('accountsChanged', () => {
            window.location.reload();
          });

          window.starcoin.on('chainChanged', () => {
            window.location.reload();
          });
        }
        // 如果之前没退出
        if (window.localStorage.getItem(LS_KEY_NAME)) {
          requestAccountFromSTC();
        }
      });

      // watch
      watch(accountHash, () => {
        if (accountHash.value === '') btnText.value = CONNECT_TEXT;
      });

      // method
      const handleAccountChanged = (accounts = []) => {
        console.log(accounts);
        if (accounts.length > 0) {
          store.dispatch('$updateAccountHash', accounts[0] || '');
          btnText.value = shortCutOfAccountHash(accountHash.value || '');
          window.localStorage.setItem(LS_KEY_NAME, 'stc');
          emitter.emit('updateAccountHash');
        }
      };

      /**
       * Request Account
       */
      const requestAccountFromSTC = () => {
        if (isStarMaskInstalled.value) {
          window.starcoin
            .request({
              method: 'stc_requestAccounts',
            })
            .then(handleAccountChanged)
            .catch((err) => {
              $message.error(err.message);
            });

          return Promise.resolve();
        }
        return Promise.reject();
      };

      /**
       * Connect Btn Click Handler
       */
      const connectWallet = () => {
        if (accountHash.value) {
          // showAccountDialog = true;
        } else {
          requestAccountFromSTC().catch(() => {
            onBoarding.startOnboarding();
          });
        }
      };
      /**
       * Remove record
       */
      const logout = () => {
        store.dispatch('$updateAccountHash', '');
        window.localStorage.removeItem(LS_KEY_NAME);
        // this.showAccountDialog = false;
      };

      return {
        btnText,
        isStarMaskInstalled,
        onBoarding,
        accountHash,

        logout,
        connectWallet,
      };
    },
  });
</script>

<style lang="less" scoped>
  .account-btn {
    display: flex;
    padding: 0 16px;
    height: 44px;
    font-size: 14px;
    align-items: center;
    margin: 0 10px;
    background: #16409c;
    border-radius: 16px;
    font-weight: 800;
    color: #d9d9ec;
    line-height: 18px;
    font-family: Source Han Sans CN;
  }
</style>
