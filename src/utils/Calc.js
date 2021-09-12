//No interest rate calculation needed
import BigNumber from 'bignumber.js';
import { tokenRate } from './common.js';

// safeWithdraw = maxWithdraw * health  ??
// safemaxRepay = maxRepay* health   ??

// withdraw / repay 需要算
// gain + interest = totalInterest
// totalInterest + supply = maxWithdraw
// totalInterset + borrow = maxRepay

const gain = (balance, market_index, user_index) => {
  let amount_b = new BigNumber(balance);
  let ret = amount_b.multipliedBy(market_index).dividedBy(user_index).minus(balance);

  return ret.toFixed(0);
};

const maxWithdrawCalc = (balance, market_index, user_index, interest = 0) => {
  return new BigNumber(gain(balance, market_index, user_index)).plus(interest).plus(balance);
};

const maxBorrowAmountCalc = (
  assets = {},
  token_price = {},
  risk_equivalents_params = {},
  risk_assets_params = 0.8,
  token = 'STC',
) => {
  let totalUsdAmount = 0;
  Object.keys(token_price).map((token) => {
    totalUsdAmount =
      totalUsdAmount + assets[token] * token_price[token] * risk_equivalents_params[token];
  });
  totalUsdAmount = totalUsdAmount * risk_assets_params;
  return totalUsdAmount / token_price[token];
};

const maxBorrowUSDCalc = (
  assets = {},
  token_price = {},
  risk_equivalents_params = {},
  risk_assets_params = 0.8,
) => {
  let totalUsdAmount = 0;
  Object.keys(token_price).map((token) => {
    totalUsdAmount =
      totalUsdAmount + assets[token] * token_price[token] * risk_equivalents_params[token];
  });
  totalUsdAmount = totalUsdAmount * risk_assets_params;
  return totalUsdAmount;
};

// const interestLinear = (amount, index, user_index, rate, timestamp) => {
//   let amount_b = new BigNumber(amount);
//   let gain = amount_b.multipliedBy(index).dividedBy(user_index).minus(amount);
//   let now = Date.now();
//   const yearSecond = 31536000;
//   const rateSecond = rate / yearSecond;
//   const timeDelta = (now - timestamp) / 1000;
//   if (timeDelta <= 0) {
//     return gain.toFixed(0);
//   }
//   let inc = amount_b.multipliedBy(timeDelta).multipliedBy(rateSecond);
//   let total = inc.plus(gain);
//   return total.toFixed(0);
// };

// const APYUser = (tokenPrice = {}, tokenList = {}, tokenBorrowAPY = {}) => {
//   // 币价(对应USDT)，通过 oracle 获得；{'STC': 100, 'MBTC': 10000}; 以该对象进行遍历
//   // 用户持有币的数量；{'STC': 100, 'MBTC': 10000}
//   // 市场借贷率；{'STC': 0.08, 'METH': 0.04}
//   let Rate = tokenRate(tokenPrice, tokenList);
//   console.log(Rate);
//   let APY = 0;
//   Object.keys(Rate).map((token) => {
//     APY = APY + tokenBorrowAPY[token] * Rate[token];
//   });
//   return APY;
// };

// const debtValue = (tokenPrice = {}, tokenList = {}) => {
//   let total = 0;
//   Object.keys(tokenPrice).map((token) => {
//     if (token in tokenList) {
//       total = total + tokenPrice[token] * tokenList[token];
//     }
//   });
//   return total;
// };

// const ltvAvg = (tokenPrice = {}, tokenList = {}, tokenLtv = {}) => {
//   let Rate = tokenRate(tokenPrice, tokenList);
//   let ltv = 0;
//   Object.keys(Rate).map((token) => {
//     ltv = ltv + tokenLtv[token] * Rate[token];
//   });
//   return ltv;
// };

export {
  gain,
  maxWithdrawCalc,
  maxBorrowAmountCalc,
  maxBorrowUSDCalc,
  // interestLinear,
  // APYUser,
  // debtValue,
  // ltvAvg
};
