import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { GetStateListResource, GetHomeAPY } from 'service/InitService';
import { toTokenString } from 'utils/';

export default () => {
  const store = useStore();
  // 从store里面获得 tokenList
  const tokenList = computed(() => store.state.tokenList);

  // 人可以读的数字
  const toHumanReadable = ({ address, amount }) => {
    const token = tokenList.value.find((token) => token.address === address);
    return token ? token.toHumanAmount(amount) : '';
  };

  // 链可以读的数字
  const toChainReadable = ({ address, amount }) => {
    const token = tokenList.value.find((token) => token.address === address);
    return token ? token.toChainAmount(amount) : '';
  };

  // 换成百分比
  const toPercent = (value, fixed = 3) => {
    return new BigNumber(value).multipliedBy(100).toNumber().toFixed(fixed) + '%';
  };

  // 币保留小数位数
  const COIN_DB_DECIMALS = 4;
  // 输入框里面放9位
  const COIN_INPUT_DECIMALS = 9;
  // 币转换成USDT保留的小数位数
  const USD_DB_DECIMALS = 2;
  // 保留小数位数
  const toDP = (value, precision = COIN_DB_DECIMALS) => {
    return !isNaN(value) ? new BigNumber(value).dp(precision, BigNumber.ROUND_DOWN) : 0;
  };

  // Mantissa要位移的位数
  const SHIFT_BY = -18;
  // 将Mantissa转换成可读可运算的方法
  const toReadableMantissa = (value) =>
    !isNaN(value) ? new BigNumber(value).shiftedBy(SHIFT_BY) : 0;

  const RISK_SHIFT_BY = -4;
  // Risk的偏移量不一样
  const toReadableRiskMantissa = (value) =>
    !isNaN(value) ? new BigNumber(value).shiftedBy(RISK_SHIFT_BY) : 0;

  // 一个Nano计算方法, 根据不同币的精度不同
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
      .multipliedBy(toReadableRiskMantissa(risk_equivalents_threshold))
      .multipliedBy(toReadableRiskMantissa(risk_assets_pthreshold));
  };

  // 排除当前币之外所有币的总抵押价值
  const getDepositUSDExcept = (address) => {
    return toDP(
      tokenList.value
        .filter((token) => token.address !== address)
        .reduce((prev, current) => {
          return new BigNumber(prev).plus(
            // 币的数量
            new BigNumber(
              current.toHumanAmount(current?.personalCollateralAsset?.token_amount || 0),
            )
              // 币的价格
              .multipliedBy(current.oracle),
          );
        }, 0),
      USD_DB_DECIMALS,
    );
  };

  // 理论可借额度
  const getCanBorrowUSDOnTheroy = (tokenList) => {
    return [...tokenList].reduce((prev, current) => {
      return new BigNumber(prev).plus(
        // 币的数量
        new BigNumber(current.toHumanAmount(current?.personalCollateralAsset?.token_amount || 0))
          // 币的价格
          .multipliedBy(current.oracle)
          // 抵押系数
          .multipliedBy(
            toReadableRiskMantissa(current.riskEquivalentsConfig.liquidation_threshold.mantissa) ||
              1,
          ),
      );
    }, 0);
  };

  // 真实可借额度
  const getCanBorrowUSDOnReal = (tokenList) => {
    return new BigNumber(getCanBorrowUSDOnTheroy(tokenList)).multipliedBy(
      // 风险系数
      toReadableRiskMantissa(tokenList[0]?.riskAssetConfig.liquidation_threshold.mantissa) || 1,
    );
  };

  const getSafeBorrowingValueOnReal = (tokenList) => {
    return new BigNumber(getCanBorrowUSDOnTheroy(tokenList)).multipliedBy(
      // 风险系数
      toReadableRiskMantissa(tokenList[0]?.riskAssetConfig.liquidation_threshold.mantissa).minus(
        reserverUnit,
      ),
    );
  };

  // 实际真实已借价值 on usdt
  // 每个币的价值 * 数量 = 已借价值
  const getTotalBorrowedUSDOnReal = (tokenList) => {
    return toDP(
      tokenList.reduce((prev, current) => {
        return new BigNumber(prev).plus(
          // 币的数量
          new BigNumber(current.toHumanAmount(current?.personalDebtAsset?.token_amount || 0))
            // 币的价格
            .multipliedBy(current.oracle),
        );
      }, 0),
      USD_DB_DECIMALS,
    );
  };

  const getOracleValue = ({ amount = 0, oracle = 0 }) =>
    new BigNumber(
      new BigNumber(amount).multipliedBy(oracle).dp(USD_DB_DECIMALS, BigNumber.ROUND_DOWN),
    );

  /**
   * 获取某个币供应的值
   */
  const getSupplyBalance = (item) =>
    toDP(
      item.toHumanAmount(
        // 存的数量
        new BigNumber(item?.personalCollateralAsset.token_amount || 0)
          // 加上 利息产生的 币
          .plus(new BigNumber(item?.personalCollateralAsset?.interest || 0).dividedBy(item.oracle)),
      ),
    );

  const getBorrowBalance = (item) =>
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

  const reserverUnit = 0.001;

  const getHomeAPY = async () => {
    const apys = await GetHomeAPY();

    const ret = {};

    apys.forEach((apy) => {
      const { token_code, borrow_rate, supply_rate } = apy;
      const address = toTokenString(token_code);
      const name = address.split('::')[2];

      if (!name) return;

      const rateMap = {
        supply_rate: toPercent(toReadableMantissa(supply_rate.mantissa), 2),
        borrow_rate: toPercent(toReadableMantissa(borrow_rate.mantissa), 2),
      };

      ret[address] = { ...rateMap };
      ret[name] = { ...rateMap };
    });

    return ret;
  };

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
      const apys = await getHomeAPY();
      const totalCanBorrowUSDOnReal = getCanBorrowUSDOnReal(tokenList);
      const totalCanBorrowUSDOnTheroy = getCanBorrowUSDOnTheroy(tokenList);
      const totalBorrowedUSDOnReal = getTotalBorrowedUSDOnReal(tokenList);

      const tokenDetails = tokenList.map((item) => {
        const borrowBalance = getBorrowBalance(item);
        const supplyBalance = getSupplyBalance(item);
        const walletResource = toDP(item.toHumanAmount(item.walletResource) || 0);

        return {
          ...item,

          reserverUnit,
          // =======================  Borrow ===================
          // 以下数据均为 共享数据, 可以考虑将其独立出一个单独的数据结构,但是其实这样挺好用的

          // 真实可借
          totalCanBorrowUSDOnReal: toDP(totalCanBorrowUSDOnReal, USD_DB_DECIMALS),
          // 理论
          totalCanBorrowUSDOnTheroy: toDP(totalCanBorrowUSDOnTheroy, USD_DB_DECIMALS),
          // 实际真实已借价值
          totalBorrowedUSDOnReal: toDP(totalBorrowedUSDOnReal, USD_DB_DECIMALS),
          // 剩余可借
          restBorrowingValueOnReal: toDP(
            new BigNumber(totalCanBorrowUSDOnTheroy).minus(totalBorrowedUSDOnReal),
            USD_DB_DECIMALS,
          ),
          // 获取其他币的价值
          getDepositUSDExcept,

          borrowedLimitUsed: (() => {
            return toPercent(
              totalCanBorrowUSDOnTheroy.valueOf() == 0
                ? 0
                : new BigNumber(totalBorrowedUSDOnReal).dividedBy(totalCanBorrowUSDOnTheroy),
            );
          })(),
          // 以上数据均为 共享数据, 可以考虑将其独立出一个单独的数据结构,但是其实这样挺好用的

          // 存取款可用比例更新
          borrowedLimitUsedUpdated: (amount) => {
            if (!amount) return 0;

            // 当前输入数量的抵押价值
            const equivalentAmount = new BigNumber(amount)
              .multipliedBy(
                toReadableRiskMantissa(item.riskEquivalentsConfig.liquidation_threshold.mantissa),
              )
              .valueOf();

            return toPercent(
              // 总借贷价值
              new BigNumber(totalBorrowedUSDOnReal).dividedBy(
                // 理解可借 + 新增的抵押价值
                getCanBorrowUSDOnTheroy(tokenList).plus(
                  new BigNumber(equivalentAmount).multipliedBy(item.oracle),
                ),
              ),
            );
          },

          // 借还款可用比例更新
          borrowedLimitUsedUpdatedOnBorrow: (amount) => {
            if (!amount) return 0;

            const bvot = getCanBorrowUSDOnTheroy(tokenList);

            return toPercent(
              bvot.valueOf() == 0
                ? 0
                : // 原有的总借贷的价值
                  new BigNumber(totalBorrowedUSDOnReal)
                    // 加上变化的价值
                    .plus(new BigNumber(amount).multipliedBy(item.oracle))
                    // 理论可借
                    .dividedBy(bvot),
            );
          },

          // 最大可取数量
          maxWithdrawBalance: () => {
            const asLeastUSD = totalBorrowedUSDOnReal.dividedBy(
              toReadableRiskMantissa(item.riskAssetConfig.liquidation_threshold.mantissa),
            );
            // 其他币是否有足够的价值
            const hasEnoughValue = getDepositUSDExcept(item.address).isGreaterThan(asLeastUSD);

            if (hasEnoughValue) {
              // 返回当前币的全部
              return toDP(supplyBalance, COIN_INPUT_DECIMALS);
            } else {
              // 返回可取的最大值
              // TODO: 这里的返回值要测试
              // 如果取不了 就返回0
              return asLeastUSD.isGreaterThan(totalCanBorrowUSDOnTheroy)
                ? 0
                : toDP(
                    totalCanBorrowUSDOnTheroy
                      // 获得最少的币数
                      .minus(asLeastUSD)
                      // 除以清算系数 (放大)
                      .dividedBy(
                        toReadableRiskMantissa(
                          item.riskAssetConfig.liquidation_threshold.mantissa,
                        ).plus(reserverUnit),
                      )
                      // 除以当前币的价格
                      .dividedBy(item.oracle),
                    COIN_INPUT_DECIMALS,
                  );
            }
          },

          // 最大可借数量
          maxBorrowBalance: () => {
            // 1. 真实可借上限usd - sum(已经借的币的USD量)=剩余可借usd
            // 2. 剩余可借usd/币价 = 剩余可借币数量
            // 3. min(剩余可借币数量,国库可用币数量)

            // 剩余多少可借
            // 真实总可借
            // 真实可借是已经包含了mantissa, 所以下面要比真实可借要小一点点
            let remainBalance = getSafeBorrowingValueOnReal(tokenList)
              // 减去 已借的
              .minus(totalBorrowedUSDOnReal)
              // 除以价格 得到币的数量
              .dividedBy(item.oracle);

            remainBalance = BigNumber.maximum(remainBalance, 0);

            return toDP(BigNumber.minimum(remainBalance, liquidity(item)), COIN_INPUT_DECIMALS);
          },

          // 最大可还
          maxRepayBalance: toDP(
            BigNumber.minimum(borrowBalance, walletResource),
            COIN_INPUT_DECIMALS,
          ),
          // =======================  Borrow ===================

          // Table Data
          supplyAPY: apys[item.name].supply_rate,
          supplyBalance,

          borrowAPY: apys[item.name].borrow_rate,
          borrowBalance,

          // pack use asset to token
          walletResource,
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
    COIN_DB_DECIMALS,

    toDP,
    nano,
    toPercent,
    getTokenList,
    getHomeAPY,
    toHumanReadable,
    toChainReadable,
    toReadableMantissa,
    toReadableRiskMantissa,

    additionBorrowLimitBalance,
    getOracleValue,
  };
};
