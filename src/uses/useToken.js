import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();
  const tokenList = computed(() => store.state.tokenList);

  return {
    tokenList,

    toHumanReadable: ({ address, amount }) => {
      const token = tokenList.value.find((token) => token.address === address);
      return token ? token.toHumanAmount(amount) : '';
    },
    toChainReadable: ({ address, amount }) => {
      const token = tokenList.value.find((token) => token.address === address);
      return token ? token.toChainAmount(amount) : '';
    },
    getTokenList: () => store.dispatch('$getTokenList'),
  };
};
