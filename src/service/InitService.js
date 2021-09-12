import { JsonProvider } from '@wormhole-stc/txn-wrapper';
import { SOURCE_ADDRESS, TEST_NETWORK, ToChainAmount, ToHumanAmount } from 'config';
import { toTokenString } from 'utils/';
import axios from 'axios';

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

const Get_Oracle = async (tokenName) =>
  tokenName == 'MUSDT'
    ? 1
    : requestChain('contract.call_v2', [
        {
          function_id: '0x1::PriceOracle::read',
          type_args: [
            `${
              tokenName === 'STC' ? '0x1' : SOURCE_ADDRESS
            }::${tokenName}USDOracle::${tokenName}USD`,
          ],
          args: [SOURCE_ADDRESS],
        },
      ]);

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

    const { resources: MyResource } = await requestChain('state.list_resource', [
      account,
      { decode: true },
    ]);

    const { body = {}, id = '' } = MyResource[KEY_Assets]?.json.items.vec[0][0] || {};
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

        const riskAssetConfig = resources[KEY_Risk_Asset_Config]?.json || {};
        const riskEquivalentsConfig = resources[KEY_Risk_Equivalents_Config(address)]?.json || {};

        const oracle = (await Get_Oracle(name)[0]) || 1;

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
