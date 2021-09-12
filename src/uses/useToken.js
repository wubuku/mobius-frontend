import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { GetPersonalAssets, GetStateListResource } from 'service/InitService';
import { toTokenString } from 'utils';

export default () => {
  const store = useStore();
  const tokenList = computed(() => store.state.tokenList);

  // 币保留小数位数
  const COIN_DB_DECIMALS = 4;
  // 币转换成USDT保留的小数位数
  const USD_DB_DECIMALS = 2;

  const SHIFT_BY = -18;

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

  const toDP = (value, precision = COIN_DB_DECIMALS) => {
    return !isNaN(value) ? new BigNumber(value).dp(precision, BigNumber.ROUND_DOWN) : 0;
  };

  const toReadMantissa = (value) => (!isNaN(value) ? new BigNumber(value).shiftedBy(SHIFT_BY) : 0);

  // Get Current Borrow Limit
  const getBorrowLimit = () => {
    console.log(tokenList);
  };

  // Get total Borrow Limit
  const getBorrownBalance = () => {
    tokenList.value.forEach((token) => {
      const borrowIndex = toReadMantissa(token.rate.vec[0].borrow_index.mantissa);
      console.log(token, borrowIndex.valueOf());
    });
  };

  const getOracleValue = ({ amount = 0, oracle = 0 }) =>
    new BigNumber(
      new BigNumber(amount).multipliedBy(oracle).dp(USD_DB_DECIMALS, BigNumber.ROUND_DOWN),
    );

  /**
   * Get Token List
   * And package all infomations
   */
  const getTokenList = async () => {
    if (!store.state.accountHash) return [];
    // Get Token List First
    try {
      // TokenList
      const { tokenList, assetId } = await GetStateListResource(store.state.accountHash);
      const tokenDetails = tokenList.map((item) => {
        return {
          ...item,
          // Table Data
          supplyAPY: toPercent(toReadMantissa(item.supply_rate.mantissa)),
          supplyBalance: toDP(item.toHumanAmount(item?.personalCollateralAsset.token_amount || 0)),
          borrowAPY: toPercent(toReadMantissa(item.borrow_rate.mantissa)),
          borrowBalance: toDP(item.toHumanAmount(item?.personalDebtAsset.token_amount || 0)),
          // pack use asset to token
          walletResource: toDP(item.toHumanAmount(item.walletResource) || 0),
          liquidity: toDP(item.toHumanAmount(item.token?.value || 0)),
        };
      });

      store.dispatch('$getTokenList', tokenDetails);
      store.dispatch('data/$updateAssetsData', assetId);
      return tokenDetails;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    tokenList,

    toHumanReadable,
    toChainReadable,
    toPercent,
    toDP,
    toReadMantissa,
    getTokenList,

    getBorrowLimit,
    getBorrownBalance,
    getOracleValue,
  };
};
