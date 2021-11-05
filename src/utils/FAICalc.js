import BigNumber from 'bignumber.js';

// 实际抵押率
export const realStakeRatio = (stakeSTCAmount, priceOfSTC, mintedFAIAmount) => {
  return new BigNumber(stakeSTCAmount)
    .multipliedBy(priceOfSTC)
    .dividedBy(mintedFAIAmount)
    .toNumber();
};

// 剩余可取STC
export const maxWithdrawableSTC = (
  stakeSTCAmount,
  mintedFAIAmount,
  miniumalStakeRatio,
  priceOfSTC,
) => {
  // 存入的STC - 实际铸造FAI*最低抵押率/STC的价格
  console.log('123123', stakeSTCAmount, mintedFAIAmount, miniumalStakeRatio, priceOfSTC);
  return new BigNumber(stakeSTCAmount)
    .minus(new BigNumber(mintedFAIAmount).multipliedBy(miniumalStakeRatio).dividedBy(priceOfSTC))
    .toNumber();
};

// 最大可铸造
export const maxCanMinit = (stakeSTCAmount, price, miniumalStakeRatio) => {
  console.log('maxCanMint', stakeSTCAmount, price, miniumalStakeRatio);
  return new BigNumber(stakeSTCAmount).multipliedBy(price).dividedBy(miniumalStakeRatio).toNumber();
};

// 剩余可铸造
export const calcAbleToGenerate = (maxMintedAmount, mintedFAIAmount) =>
  new BigNumber(maxMintedAmount).minus(mintedFAIAmount).dp(4).toNumber();
