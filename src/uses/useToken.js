import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  GetPersonalAssets,
  GetTokenList,
  TokenStandardPosition,
  GetTokenUSDPrice,
  GetRiskEquivalentsConfig,
  GetRiskAssetsConfig,
  GetPersonalResource,
} from 'service/InitService';
import { toTokenString } from 'utils';

export default () => {
  const store = useStore();
  const tokenList = computed(() => store.state.tokenList);

  // 币保留小数位数
  const COIN_DB_DECIMALS = 4;
  // 币转换成USDT保留的小数位数
  const USD_DB_DECIMALS = 2;

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

  const toReadMantissa = (value) => (!isNaN(value) ? new BigNumber(value).shiftedBy(-18) : 0);

  const getBorrowLimit = ({ amount = 0, oracle = 0, health = 0.8 }) =>
    new BigNumber(
      new BigNumber(amount)
        .multipliedBy(oracle)
        .multipliedBy(health)
        .dp(USD_DB_DECIMALS, BigNumber.ROUND_DOWN),
    );

  const getOracleValue = ({ amount = 0, oracle = 0 }) =>
    new BigNumber(
      new BigNumber(amount).multipliedBy(oracle).dp(USD_DB_DECIMALS, BigNumber.ROUND_DOWN),
    );

  /**
   * Get user's Assets
   * @param {string} accountHash
   * @returns
   */
  const getPersonalAssets = async (accountHash) => {
    if (!accountHash) return {};

    try {
      const ret = await GetPersonalAssets(accountHash);
      const { collateral = [], debt = [], id } = ret.json?.items?.vec[0][0]?.body?.assets || {};
      const collateralList = [];
      const debtList = [];

      // Save Asset Id
      store.dispatch('data/$updateAssetsData', ret.json?.items?.vec[0][0]);

      collateral.forEach((asset) => {
        const address = toTokenString(asset.token_code);
        const name = address.split('::')[2];
        collateralList[name] = {
          ...asset,
        };
      });

      debt.forEach((asset) => {
        const address = toTokenString(asset.token_code);
        const name = address.split('::')[2];
        debtList[name] = {
          ...asset,
        };
      });

      return { collateralList, debtList };
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Get Token List
   * And package all infomations
   */
  const getTokenList = async () => {
    // Get Token List First
    try {
      // TokenList
      const res = (await GetTokenList()) || [];
      const tokens = res?.json?.payload?.support_token_codes || [];

      // update collateral / debt
      const { collateralList = [], debtList = [] } =
        (await getPersonalAssets(store.state.accountHash)) || {};

      // Resource in wallet
      const resources = (await GetPersonalResource(store.state.accountHash)) || [];

      if (tokens.length > 0) {
        // Get Detail of each Token
        const tokenDetails = await Promise.all(
          tokens.map(async (token) => {
            // Address of current token
            const address = toTokenString(token);

            // Wallet Resource about current token
            const currentWalletResource =
              resources.filter((resource) => resource.address === address)[0] || {};

            // Token Name
            const tokenName = address.split('::').pop();
            // Token Oracle
            const oracle = (await GetTokenUSDPrice(tokenName))[0] || 0;

            // Risk Pararms
            const { json: riskParams = {} } = (await GetRiskEquivalentsConfig(tokenName)) || {};
            const { json: riskAssets = {} } = (await GetRiskAssetsConfig(tokenName)) || {};

            // The Market infomation of current Token
            const detail = await TokenStandardPosition(address);

            // The balance about supply and borrow of current address
            const tokenCollateral = collateralList[tokenName] || {};
            const tokenDebt = debtList[tokenName] || {};

            return {
              // Table Data
              riskParams,
              riskAssets,
              supplyAPY: toPercent(toReadMantissa(detail.supply_rate.mantissa)),
              supplyBalance: toDP(detail.toHumanAmount(tokenCollateral?.token_amount || 0)),
              borrowAPY: toPercent(toReadMantissa(detail.borrow_rate.mantissa)),
              borrowBalance: toDP(detail.toHumanAmount(tokenDebt?.token_amount || 0)),
              // Asset Data
              // pack use asset to token
              personalCollateralAsset: collateralList[tokenName] || {},
              personalDebtAsset: debtList[tokenName] || {},
              walletResource: toDP(currentWalletResource.amount || 0, COIN_DB_DECIMALS),
              // Basic Data
              name: tokenName,
              address,
              oracle,
              ...detail,
            };
          }),
        );

        // Merge Detail and Token Basic Name

        store.dispatch('$getTokenList', tokenDetails);
      }
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
    getOracleValue,
  };
};
