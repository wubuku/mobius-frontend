import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();
  const firstTokenName = ref('');
  const tokenList = computed(() => store.state.tokenList);

  watch(tokenList, (newVal) => {
    firstTokenName.value = newVal[0].name;
  });

  return {
    firstTokenName,
    tokenList,

    toHumanReadable: ({ tokenName, amount }) => {
      const token = tokenList.value.find((token) => token.name === tokenName);
      return token ? token.toHumanAmount(amount) : '';
    },
    toChainReadable: ({ tokenName, amount }) => {
      const token = tokenList.value.find((token) => token.name === tokenName);
      return token ? token.toChainAmount(amount) : '';
    },
    getTokenList: () => store.dispatch('$getTokenList'),
  };
};
