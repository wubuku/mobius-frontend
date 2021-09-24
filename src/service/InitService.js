import { JsonProvider } from '@wormhole-stc/txn-wrapper';
import { SOURCE_ADDRESS, TEST_NETWORK, ToChainAmount, ToHumanAmount } from 'config';
import { toTokenString } from 'utils/';
import axios from 'axios';
import BigNumber from 'bignumber.js';

// Global Data

const requestChain = (method, params) =>
  axios
    .post('https://barnard-seed.starcoin.org/', {
      id: 1,
      jsonrpc: '2.0',
      method,
      params,
    })
    .then((res) => res.data.result);

/**
 * Get Transaction Status
 */
export const GetTransactionStatus = (txHash) => {
  return JsonProvider(TEST_NETWORK).getTransactionInfo(txHash);
};

// Token List
const KEY_TokenList = `0x00000000000000000000000000000001::Config::Config<${SOURCE_ADDRESS}::Management::PositionConfig<${SOURCE_ADDRESS}::Management::StandardPosition>>`;

// StandardPosition
const KEY_StandardPosition = (token) =>
  `${SOURCE_ADDRESS}::Treasury::Position<${SOURCE_ADDRESS}::Management::StandardPosition, ${token}>`;

// Assets
const KEY_Assets = `${SOURCE_ADDRESS}::AssetsGallery::AssetsGalleryStore<0x00000000000000000000000000000001::NFT::NFT<${SOURCE_ADDRESS}::Assets::AMeta<${SOURCE_ADDRESS}::Management::StandardPosition>, ${SOURCE_ADDRESS}::Assets::ABody<${SOURCE_ADDRESS}::Treasury::Assets<${SOURCE_ADDRESS}::Management::StandardPosition>>>>`;

// Personal Balance
const KEY_Balance = (token) => `0x00000000000000000000000000000001::Account::Balance<${token}>`;

const KEY_Risk_Asset_Config = `${SOURCE_ADDRESS}::Risk::AssetsConfig<${SOURCE_ADDRESS}::Management::StandardPosition>`;

const KEY_Risk_Equivalents_Config = (token) =>
  `${SOURCE_ADDRESS}::Risk::EquivalentsConfig<${SOURCE_ADDRESS}::Management::StandardPosition, ${token}>`;

const Get_Precision = async (token) =>
  requestChain('contract.call_v2', [
    { function_id: '0x1::Token::scaling_factor', type_args: [token], args: [] },
  ]);

const Get_Oracle = async () => {
  return axios
    .get(
      'http://afbfd94cad1f34843aef457c1094dfd8-2035541950.ap-northeast-1.elb.amazonaws.com/barnard/v1/priceFeeds',
    )
    .then((res) => {
      const ret = {};
      res.data
        .filter((oracle) => ['BTC / USD', 'ETH / USD', 'STC / USD'].includes(oracle.pairName))
        .forEach((oracle) => {
          const name = oracle.pairName.split(' ')[0];
          ret[name === 'STC' ? name : `M${name}`] = new BigNumber(oracle.latestPrice)
            .shiftedBy(-1 * oracle.decimals)
            .valueOf();
        });

      ret['MUSDT'] = 1;

      return ret;
    });
};

export const GetHomeAPY = async () => {
  const { resources } = await requestChain('state.list_resource', [
    SOURCE_ADDRESS,
    { decode: true },
  ]);

  return (resources[KEY_TokenList]?.json?.payload?.support_token_codes || []).map((codes) => {
    const address = toTokenString(codes);
    const name = address.split('::')[2];

    // Get All StandardPosition
    const standardPosition = resources[KEY_StandardPosition(address)]?.json || {};

    return {
      name,
      supply_rate: standardPosition.supply_rate.mantissa,
    };
  });
};

/**
 * Very Important function
 * 获取基本所有的资源数据
 * @param {string} accountHash
 * @returns
 */
export const GetStateListResource = async (accountHash) => {
  if (!accountHash) return;

  try {
    const account = accountHash.toLowerCase();
    const { resources } = await requestChain('state.list_resource', [
      SOURCE_ADDRESS,
      { decode: true },
    ]);

    const oracles = await Get_Oracle();

    const { resources: MyResource } = await requestChain('state.list_resource', [
      account,
      { decode: true },
    ]);

    // 选择assetId最小的头寸
    let assetVec = { id: Infinity };
    if (Array.isArray(MyResource[KEY_Assets]?.json.items.vec[0])) {
      MyResource[KEY_Assets]?.json.items.vec[0].forEach((asset) => {
        if (assetVec.id > asset.id) {
          assetVec = { ...asset };
        }
      });
    }

    const { body = {}, id = '' } = assetVec.id === Infinity ? {} : assetVec;
    const { collateral = [], debt = [] } = body?.assets || {};

    // Get All tokens
    const tokenList = await Promise.all(
      (resources[KEY_TokenList]?.json?.payload?.support_token_codes || []).map(async (codes) => {
        const address = toTokenString(codes);
        const name = address.split('::')[2];
        // Get All StandardPosition
        const standardPosition = resources[KEY_StandardPosition(address)]?.json || {};

        // Personal Asset
        const personalCollateralAsset =
          collateral.filter((item) => toTokenString(item.token_code) === address)[0] || {};
        const personalDebtAsset =
          debt.filter((item) => toTokenString(item.token_code) === address)[0] || {};

        const percision = (await Get_Precision(address)[0]) || 1e9;
        // Wallet Resource
        const walletResource = MyResource[KEY_Balance(address)]?.json?.token?.value || 0;

        // 清算预置
        const riskAssetConfig = resources[KEY_Risk_Asset_Config]?.json || {};
        // 抵押系数
        const riskEquivalentsConfig = resources[KEY_Risk_Equivalents_Config(address)]?.json || {};

        const oracle = oracles[name];

        return {
          address,
          name,
          percision,
          oracle,
          personalCollateralAsset,
          personalDebtAsset,
          walletResource,
          riskAssetConfig,
          riskEquivalentsConfig,
          toChainAmount: (amount) => ToChainAmount(amount, percision),
          toHumanAmount: (amount) => ToHumanAmount(amount, percision),
          ...standardPosition,
        };
      }),
    );

    return { tokenList, assetId: id };
  } catch (err) {
    console.log(err);
  }
};
