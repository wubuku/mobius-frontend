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
        currentResource.value = tokens.filter((token) => token['tokenName'] === address)[0] || {
          amount: 0,
          name,
          tokenName: address,
        };
      }
    });
  };

  return {
    myResource,
    currentResource,
    accountHash: computed(() => store.state.accountHash),
    // Page Data
    collateralList: computed(() => store.state.data.collateral),
    assetId: computed(() => store.state.data.assetId),
    debtList: computed(() => store.state.data.debt),

    hasNoAsset: computed(
      () => store.state.data.collateral.length === 0 && store.state.data.debt.length === 0,
    ),

    // Actions
    setPersonalAssets: (assets) => store.dispatch('data/$updateAssetsData', assets),
  };
};
