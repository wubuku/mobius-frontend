import TxnWrapper, { JsonProvider } from '@wormhole-stc/txn-wrapper';
import { SOURCE_ADDRESS } from 'config';

/**
 * Init Asset when there is no asset
 */
export const InitAssetContract = ({ token, amount }) => {
  return TxnWrapper({
    functionId: `${SOURCE_ADDRESS}::MarketScript::init_assets`,
    typeTag: [token.address],
    params: [token.toChainAmount(amount)],
  });
};

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
