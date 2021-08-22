import TxnWrapper, { JsonProvider } from '@wormhole-stc/txn-wrapper';

const SOURCE_ADDRESS = '0x9553fa700207336dd51ef8b0e4f5a2e7';
const TEST_NETWORK = process.env.VUE_APP_TEST_CHAIN || '';

/**
 * Deposit
 */

export const DepositContract = ({ token, nftId, amount }) => {
  return TxnWrapper({
    functionId: `${SOURCE_ADDRESS}::MarketScript::deposit`,
    typeTag: [token.address],
    params: [nftId, token.toChainAmount(amount)],
  });
};

/**
 * Withdraw
 */
export const WithdrawContract = ({ token, nftId, amount }) => {
  console.log(token, nftId, amount);
  return TxnWrapper({
    functionId: `${SOURCE_ADDRESS}::MarketScript::withdraw`,
    typeTag: [token.address],
    params: [nftId, token.toChainAmount(amount)],
  });
};

// export const MintVoucher = ({ token, amount }) => {
//   return TxnWrapper({
//     functionId: `${SOURCE_ADDRESS}::MarketScript::mint_voucher`,
//     typeTag: [token.address],
//     params: [token.toChainAmount(amount)],
//   });
// };
