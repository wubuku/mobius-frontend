import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { GetPersonalResource } from 'service/InitService';

export default () => {
  const store = useStore();
  const currentResource = ref({});

  // 获取当前用户的个人资源
  const myResource = ({ account = '', address = '' }) => {
    if (!account) return;

    GetPersonalResource(account).then((tokens) => {
      if (Array.isArray(tokens)) {
        const name = address.split('::')[2];
        currentResource.value = tokens.filter((token) => token['address'] === address)[0] || {
          amount: 0,
          name,
          address,
        };
      }
    });
  };

  const accountHash = computed(() => store.state.accountHash);
  const collateralList = computed(() => store.state.data.collateral);
  const assetId = computed(() => store.state.data.assetId);
  const debtList = computed(() => {
    console.log(store);
    return store.state.data.debt;
  });
  const chainId = computed(() => {
    console.log(store);
    return store.state.data.chainId;
  });
  const hasNoAsset = computed(
    () => store.state.data.collateral.length === 0 && store.state.data.debt.length === 0,
  );

  return {
    myResource,
    currentResource,
    accountHash,
    // Page Data
    collateralList,
    assetId,
    debtList,
    chainId,
    hasNoAsset,

    // Actions
    setPersonalAssets: (assets) => store.dispatch('data/$updateAssetsData', assets),
    setChainId: (chainId) => store.dispatch('data/$updateChainId', chainId),
  };
};
