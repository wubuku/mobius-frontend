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

  /**
   *  Balance 表示币本位, 返回值一般是币的数量
   *
   *  Value  表示U本位,返回值一般是对应USDT的价值
   */

  /**
   * 修改Amount带来的额外可借额度计算
   * @returns
   */
  const additionBorrowLimitBalance = ({
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

  // 排除当前币之外所有币的总抵押价值
  const getDepositValueExcept = (address) => {
    return tokenList.value
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

  // 理论可借额度
  const getBorrowedValueOnTheroy = (tokenList) => {
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

  // 真实可借额度
  const getBorrowValueOnReal = (tokenList) => {
    return new BigNumber(getBorrowedValueOnTheroy(tokenList)).multipliedBy(
      // 风险系数
      toReadMantissa(tokenList[0]?.riskAssetConfig.liquidation_threshold.mantissa) || 1,
    );
  };

  // 实际真实已借价值 on usdt
  // 每个币的价值 * 数量 = 已借价值
  const getTotalRealBorrowValue = (tokenList) => {
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

  /**
   * 获取某个币供应的值
   */
  const supplyBalance = (item) =>
    toDP(
      item.toHumanAmount(
        // 存的数量
        new BigNumber(item?.personalCollateralAsset.token_amount || 0)
          // 加上 利息产生的 币
          .plus(new BigNumber(item?.personalCollateralAsset?.interest || 0).dividedBy(item.oracle)),
      ),
    );

  const borrowBalance = (item) =>
    toDP(
      item.toHumanAmount(
        new BigNumber(item?.personalDebtAsset.token_amount || 0).plus(
          item?.personalDebtAsset?.interest || 0,
        ),
      ),
    );

  // 国库 流通性
  const liquidity = (item) =>
    toDP(item.toHumanAmount(new BigNumber(item.collateral_amount).minus(item.debt_amount)));

  const reserverUnit = 0.1;

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
      const totalBorrowedValueOnReal = getBorrowValueOnReal(tokenList);
      const totalBorrowedValueOnTheroy = getBorrowedValueOnTheroy(tokenList);
      const totalRealBorrowedValue = getTotalRealBorrowValue(tokenList);

      const tokenDetails = tokenList.map((item) => {
        return {
          ...item,

          reserverUnit,
          // =======================  Borrow ===================
          // 真实可借
          totalBorrowedValueOnReal,
          // 理论
          totalBorrowedValueOnTheroy,
          // 实际真实已借价值
          totalRealBorrowedValue,
          // 获取其他币的价值
          getDepositValueExcept,

          borrowedLimitUsed: toPercent(
            new BigNumber(totalRealBorrowedValue).dividedBy(totalBorrowedValueOnTheroy),
          ),

          // 百分比更新
          borrowedLimitUsedUpdate: (amount) => {
            if (!amount) return 0;

            // 当前输入数量的抵押价值
            const equivalentAmount = new BigNumber(amount)
              .multipliedBy(
                toReadMantissa(item.riskEquivalentsConfig.liquidation_threshold.mantissa),
              )
              .valueOf();

            return toPercent(
              // 总借贷价值
              new BigNumber(totalRealBorrowedValue).dividedBy(
                // 理解可借 + 新增的抵押价值
                getBorrowedValueOnTheroy(tokenList).plus(
                  new BigNumber(equivalentAmount).multipliedBy(item.oracle),
                ),
              ),
            );
          },

          borrowedLimitUsedUpdateOnBorrow: (amount) => {
            if (!amount) return 0;

            // 当前输入数量的抵押价值
            const equivalentAmount = new BigNumber(amount)
              .multipliedBy(
                toReadMantissa(item.riskEquivalentsConfig.liquidation_threshold.mantissa),
              )
              .valueOf();

            return toPercent(
              // 原有的总借贷的价值
              new BigNumber(totalRealBorrowedValue)
                // 加上变化的价值
                .plus(new BigNumber(equivalentAmount).multipliedBy(item.oracle))
                .dividedBy(
                  // 理论可借
                  getBorrowedValueOnTheroy(tokenList),
                ),
            );
          },

          // 最大可取数量
          maxWithdrawBalance: () => {
            const asLeastUSD = totalRealBorrowedValue.dividedBy(
              toReadMantissa(item.riskAssetConfig.liquidation_threshold.mantissa),
            );
            // 其他币是否有足够的价值
            const hasEnoughValue = getDepositValueExcept(item.address).isGreaterThan(asLeastUSD);

            if (hasEnoughValue) {
              // 返回当前币的全部
              return supplyBalance(item).valueOf();
            } else {
              // 返回可取的最大值
              return (
                totalBorrowedValueOnTheroy
                  // 获得最少的币数
                  .minus(asLeastUSD)
                  // 去掉一个保留比例
                  .minus(reserverUnit)
                  // 除以清算系数 (放大)
                  .dividedBy(toReadMantissa(item.riskAssetConfig.liquidation_threshold.mantissa))
                  // 除以当前币的价格
                  .dividedBy(item.oracle)
                  .valueOf()
              );
            }
          },

          maxBorrowBalance: () => {
            // realBorrow * 0.8 - totalBorrowedValueOnTheroy

            // 剩余多少可借
            // 真实总可借
            const remainBalance = totalBorrowedValueOnReal
              // 减去 已借的
              .minus(totalRealBorrowedValue)
              .minus(reserverUnit)
              .dividedBy(toReadMantissa(item.riskAssetConfig.liquidation_threshold.mantissa))
              // 除以价格 得到币的数量
              .dividedBy(item.oracle);

            return BigNumber.minimum(remainBalance, liquidity(item));
          },

          // Table Data
          supplyAPY: toPercent(toReadMantissa(item.supply_rate.mantissa)),
          supplyBalance: supplyBalance(item),

          borrowAPY: toPercent(toReadMantissa(item.borrow_rate.mantissa)),
          borrowBalance: borrowBalance(item),

          // pack use asset to token
          walletResource: toDP(item.toHumanAmount(item.walletResource) || 0),
          liquidity: liquidity(item),
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

    additionBorrowLimitBalance,
    getOracleValue,
  };
};
