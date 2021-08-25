import { CurrencyAmount, Star } from '@starcoin/starswap-sdk-core';
import { JsonProvider } from '@wormhole-stc/txn-wrapper';
import { SOURCE_ADDRESS, TEST_NETWORK, ToChainAmount, ToHumanAmount } from 'config';
import BigNumber from 'bignumber.js';

// Global Data
/**
 * Token List
 */
export const GetTokenList = () => {
  return JsonProvider(TEST_NETWORK).send('state.get_resource', [
    SOURCE_ADDRESS,
    `0x00000000000000000000000000000001::Config::Config<${SOURCE_ADDRESS}::Management::PositionConfig<${SOURCE_ADDRESS}::Management::StandardPosition>>`,
    { decode: true },
  ]);
};

/**
 * Single Token
 */
export const TokenStandardPosition = (token) => {
  // Token 的 Overview
  const overview = JsonProvider(TEST_NETWORK).send('state.get_resource', [
    SOURCE_ADDRESS,
    `${SOURCE_ADDRESS}::Treasury::Position<${SOURCE_ADDRESS}::Management::StandardPosition, ${token}>`,
    { decode: true },
  ]);

  // 精度
  const precision = JsonProvider(TEST_NETWORK).send('contract.call_v2', [
    { function_id: '0x1::Token::scaling_factor', type_args: ['0x1::STC::STC'], args: [] },
  ]);

  return Promise.all([overview, precision]).then(([overview, precision]) => {
    const base = {
      precision: precision[0],
      toChainAmount: (amount) => ToChainAmount(amount, precision[0]),
      toHumanAmount: (amount) => ToHumanAmount(amount, precision[0]),
    };

    if (!overview) return base;

    const { json } = overview;
    return {
      ...json,
      ...base,
    };
  });
};

/**
 * Get Transaction Status
 */
export const GetTransactionStatus = (txHash) => {
  return JsonProvider(TEST_NETWORK).getTransactionInfo(txHash);
};

/**
 * Personal Voucher
 */
export const GetPersonalVoucher = ({ account, token }) => {
  return JsonProvider(TEST_NETWORK).send('state.get_resource', [
    account,
    `0x00000000000000000000000000000001::NFTGallery::NFTGallery<${SOURCE_ADDRESS}::Voucher::VMeta<${SOURCE_ADDRESS}::Management::StandardPosition>, ${SOURCE_ADDRESS}::Voucher::VBody<${SOURCE_ADDRESS}::Management::StandardPosition, ${token}>>`,
    { decode: true },
  ]);
};

/**
 * Personal Assets
 */
export const GetPersonalAssets = (account = '') => {
  return JsonProvider(TEST_NETWORK).send('state.get_resource', [
    account,
    `${SOURCE_ADDRESS}::AssetsGallery::AssetsGalleryStore<0x00000000000000000000000000000001::NFT::NFT<${SOURCE_ADDRESS}::Assets::AMeta<${SOURCE_ADDRESS}::Management::StandardPosition>, ${SOURCE_ADDRESS}::Assets::ABody<${SOURCE_ADDRESS}::Treasury::Assets<${SOURCE_ADDRESS}::Management::StandardPosition>>>>`,
    { decode: true },
  ]);
};

/**
 * Get Personal Assets Id
 */
export const GetTokenAssetId = (account = '') => {
  return JsonProvider(TEST_NETWORK)
    .send('contract.call_v2', [
      {
        function_id: `${SOURCE_ADDRESS}::AssetsGallery::get_single_assets_id`,
        type_args: ['0xf8af03dd08de49d81e4efd9e24c039cc::Management::StandardPosition'],
        args: [account],
      },
    ])
    .then((res) => res[0].vec.length);
};

/**
 *  Get Chain Id
 */
export const GetChainId = async () => {
  const { chainId } = await JsonProvider(TEST_NETWORK).detectNetwork();
  return chainId || '';
};

/**
 * Personal Resource
 */
export const GetPersonalResource = async (account = '') => {
  try {
    if (!window.starcoin) return;

    const resources = await JsonProvider().getBalances(account);
    return Promise.all(
      Object.keys(resources).map(async (resource) => {
        const [address, module, token] = resource.split('::');
        const amount = await CurrencyAmount.fromRawAmount(
          Star.onChain(parseInt(window.starcoin.networkVersion)),
          new BigNumber(resources[resource]),
        );
        return {
          address: resource,
          name: token,
          amount: amount.toSignificant(9),
        };
      }),
    );
  } catch (err) {
    console.log(err);
  }
};
