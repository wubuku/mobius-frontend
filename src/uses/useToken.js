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
    return new BigNumber(value).multipliedBy(100).toFixed(3) + '%';
  };

  const toFixed = (value, precision = 2) => {
    return !isNaN(value) ? new BigNumber(value).toFixed(precision) : 0;
  };

  const toReadMantissa = (value) => (!isNaN(value) ? new BigNumber(value).shiftedBy(-18) : 0);

  const getTokenList = () => store.dispatch('$getTokenList');

  const getBorrowLimit = ({ amount = 0, oracle = 0, health = 0.8 }) =>
    new BigNumber(new BigNumber(amount).multipliedBy(oracle).multipliedBy(health).toFixed(2));

  const getOracleValue = ({ amount = 0, oracle = 0 }) =>
    new BigNumber(new BigNumber(amount).multipliedBy(oracle).toFixed(2));

  return {
    tokenList,

    toHumanReadable,
    toChainReadable,
    toPercent,
    toFixed,
    toReadMantissa,
    getTokenList,

    getBorrowLimit,
    getOracleValue,
  };
};
