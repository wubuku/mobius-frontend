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

  const nano = (percision) => new BigNumber(1).dividedBy(percision);

  const additionBorrowLimitCalc = ({
    amount,
    oracle,
    risk_equivalents_threshold,
    risk_assets_pthreshold,
  }) => {
    return new BigNumber(amount)
      .multipliedBy(oracle)
      .multipliedBy(toReadMantissa(risk_equivalents_threshold))
      .multipliedBy(toReadMantissa(risk_assets_pthreshold));
  };

  const totalBorrowedLimitCalc = (tokens) => {
    //  additionBorrowLimitCalc(tokens) + token
  };

  // Get total Borrow Limit

  // 排除当前币之外所有币的总抵押价值
  const getDepositValue = (tokenList, address) => {
    return tokenList
      .filter((token) => token.address !== address)
      .reduce((prev, current) => {
        return new BigNumber(prev).plus(
          // 币的数量
          new BigNumber(current.toHumanAmount(current?.personalCollateralAsset?.token_amount || 0))
            // 币的价格
            .multipliedBy(current.oracle),
        );
      }, 0);
  };

  // 理论可借
  const getBorrowedBalanceOnTheroy = (tokenList) => {
    return [...tokenList].reduce((prev, current) => {
      return new BigNumber(prev).plus(
        // 币的数量
        new BigNumber(current.toHumanAmount(current?.personalCollateralAsset?.token_amount || 0))
          // 币的价格
          .multipliedBy(current.oracle)
          // 抵押系数
          .multipliedBy(
            toReadMantissa(current.riskEquivalentsConfig.liquidation_threshold.mantissa) || 1,
          ),
      );
    }, 0);
  };

  // 真实可借
  const getBorrowBalanceOnReal = (tokenList) => {
    return new BigNumber(getBorrowedBalanceOnTheroy(tokenList)).multipliedBy(
      // 风险系数
      toReadMantissa(tokenList[0]?.riskAssetConfig.liquidation_threshold.mantissa) || 1,
    );
  };

  // 实际真实已借价值 on usdt
  const realBorrowedCalc = (tokenList) => {
    return tokenList.reduce((prev, current) => {
      return new BigNumber(prev).plus(
        // 币的数量
        new BigNumber(current.toHumanAmount(current?.personalDebtAsset?.token_amount || 0))
          // 币的价格
          .multipliedBy(current.oracle),
      );
    }, 0);
  };

  const getOracleValue = ({ amount = 0, oracle = 0 }) =>
    new BigNumber(
      new BigNumber(amount).multipliedBy(oracle).dp(USD_DB_DECIMALS, BigNumber.ROUND_DOWN),
    );

  const supplyBalance = (item) =>
    toDP(
      item.toHumanAmount(
        new BigNumber(item?.personalCollateralAsset.token_amount || 0).plus(
          item?.personalCollateralAsset?.interest || 0,
        ),
      ),
    );

  const reserverUnit = 0.001;

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
      const totalBorrowedBalanceOnReal = getBorrowBalanceOnReal(tokenList);
      const totalBorrowedBalanceOnTheroy = getBorrowedBalanceOnTheroy(tokenList);
      const totalRealBorrowed = realBorrowedCalc(tokenList);

      const tokenDetails = tokenList.map((item) => {
        return {
          ...item,

          reserverUnit,
          // 真实可借
          totalBorrowedBalanceOnReal,
          // 理论
          totalBorrowedBalanceOnTheroy,
          // 实际真实已借价值
          totalRealBorrowed,

          getDepositValue: getDepositValue(tokenList, item.address),

          borrowedLimitUsed: toPercent(
            new BigNumber(totalRealBorrowed).dividedBy(totalBorrowedBalanceOnTheroy),
          ),

          borrowedLimitUsedUpdate: (amount) => {
            if (!amount) return 0;

            const equivalentAmount = new BigNumber(amount)
              .multipliedBy(
                toReadMantissa(item.riskEquivalentsConfig.liquidation_threshold.mantissa),
              )
              .valueOf();

            return toPercent(
              new BigNumber(totalRealBorrowed).dividedBy(
                // 真实的,加上新增的
                getBorrowedBalanceOnTheroy(tokenList).plus(
                  new BigNumber(equivalentAmount).multipliedBy(item.oracle),
                ),
              ),
            );
          },
          // 最大可取数量
          maxWithdrawAmount: () => {
            const asLeastUSD = totalRealBorrowed.dividedBy(
              toReadMantissa(item.riskAssetConfig.liquidation_threshold.mantissa),
            );
            // 其他币是否有足够的价值
            const hasEnoughValue = getDepositValue(tokenList, item.address).isGreaterThan(
              asLeastUSD,
            );

            if (hasEnoughValue) {
              // 返回当前币的全部
              return supplyBalance(item).valueOf();
            } else {
              // 返回可取的最大值
              return (
                totalBorrowedBalanceOnTheroy
                  // 获得最少的币数
                  .minus(asLeastUSD)
                  .minus(reserverUnit)
                  .dividedBy(toReadMantissa(item.riskAssetConfig.liquidation_threshold.mantissa))
                  .dividedBy(item.oracle)
                  .valueOf()
              );
            }
          },

          // Table Data
          supplyAPY: toPercent(toReadMantissa(item.supply_rate.mantissa)),
          supplyBalance: supplyBalance(item),
          borrowAPY: toPercent(toReadMantissa(item.borrow_rate.mantissa)),
          borrowBalance: toDP(
            item.toHumanAmount(
              new BigNumber(item?.personalDebtAsset.token_amount || 0).plus(
                item?.personalDebtAsset?.interest || 0,
              ),
            ),
          ),

          // pack use asset to token
          walletResource: toDP(item.toHumanAmount(item.walletResource) || 0),
          liquidity: toDP(
            item.toHumanAmount(new BigNumber(item.collateral_amount).minus(item.debt_amount)),
          ),
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
    nano,

    additionBorrowLimitCalc,
    getOracleValue,
  };
};
