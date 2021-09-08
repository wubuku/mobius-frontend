import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();
  const tokenList = computed(() => store.state.tokenList);

  const toHumanReadable = ({ address, amount }) => {
    const token = tokenList.value.find((token) => token.address === address);
    return token ? token.toHumanAmount(amount) : '';
  };
  const toChainReadable = ({ address, amount }) => {
    const token = tokenList.value.find((token) => token.address === address);
    return token ? token.toChainAmount(amount) : '';
  };
  const toPercent = (value) => {
    return new BigNumber(value).multipliedBy(100).toPrecision(3) + '%';
  };
  const toPrecision = (value, precision = 5) => {
    return !isNaN(value) ? new BigNumber(value).toPrecision(precision) : 0;
  };
  const getTokenList = () => store.dispatch('$getTokenList');

  return {
    tokenList,

    toHumanReadable,
    toChainReadable,
    toPercent,
    toPrecision,
    getTokenList,
  };
};
