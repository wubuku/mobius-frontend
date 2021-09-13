import { computed, ref, onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();
  const currentResource = ref({});

  const accountHash = computed(() => store.state.accountHash);
  const collateral = computed(() => store.state.data.collateral);
  const assetId = computed(() => store.state.data.assetId);
  const debt = computed(() => store.state.data.debt);
  const wallet = computed(() => store.state.data.wallet);
  const walletArray = computed(() => store.state.data.walletArray);

  const hasNoAsset = computed(
    () => store.state.data.collateral.length === 0 && store.state.data.debt.length === 0,
  );
  const setPersonalAssets = (assets) => store.dispatch('data/$updateAssetsData', assets);
  const setWalletResource = (resources) => store.dispatch('data/$updateWalletResource', resources);

  // 获取当前用户的个人资源
  const myResource = ({ account = '', address = '' }) => {
    if (!account) return;
  };

  return {
    myResource,
    currentResource,
    accountHash,
    // Page Data
    assetId,
    collateral,
    debt,
    hasNoAsset,
    wallet,
    walletArray,

    // Actions
    setPersonalAssets,
    setWalletResource,
  };
};
