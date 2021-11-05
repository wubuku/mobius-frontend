import TxnWrapper, { JsonProvider } from 'utils/TxnWrapper';
import { BFLY_CONTRACT_ADDRESS, TEST_NETWORK, ToChainAmount, ToHumanAmount, ENUMS } from 'config';
import { toTokenString, requestChain } from 'utils/';
import BigNumber from 'bignumber.js';
import axios from 'axios';

// ==================================== GET PRICE =====================================
export const getPrice = async () => {
  return (await axios.get('https://price-api.starcoin.org/barnard/v1/priceFeeds')).data || [];
};

// ===================================== GET BALANCE =====================================
export const getBalance = async (address, token = '0x1::STC::STC') => {
  const provider = new JsonProvider(TEST_NETWORK);
  return await provider.getBalance(address, token);
};

// ===================================== CHECK USER VAULT IS EXSIT =====================================
export const checkUserVaultIsExsit = async (address) => {
  try {
    const [result] = await requestChain('contract.call_v2', [
      {
        function_id: `${BFLY_CONTRACT_ADDRESS}::Vault::vault_exist`,
        args: [address],
        type_args: [`${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::VaultPool`, '0x1::STC::STC'],
      },
    ]);
    console.log('STCVaultPoolA::VaultPool', result);
    return result;
  } catch (e) {
    return e;
  }
};

// ===================================== GET USER VAULT =====================================

/**
 * 
		vault.id,
		vault.debt_fai_amount,
		vault.unpay_stability_fee + stability_fee,
		balance_for<VaultPool, STC>(vault),
		Timestamp::now_seconds()
 */
export const getUserVault = async (address) => {
  try {
    const result = await requestChain('contract.call_v2', [
      {
        function_id: `${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::info`,
        args: [address],
        type_args: [],
      },
    ]);
    console.log('STCVaultPoolA::info', result);
    return result || [];
  } catch (e) {
    return e;
  }
};

// ===================================== GET STC LOCKED =============================================
export const getSTCLocked = async () => {
  try {
    const result = await requestChain('contract.call_v2', [
      {
        function_id: `${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::current_stc_locked`,
        args: [],
        type_args: [],
      },
    ]);
    return result;
  } catch (e) {
    return e;
  }
};

// ===================================== GET BALANCE OF FAL IN MARKET =====================================
export const getBalanceOfFaiInMarket = async () => {
  try {
    const [result] = await requestChain('contract.call_v2', [
      {
        function_id: `${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::current_fai_supply`,
        args: [],
        type_args: [],
      },
    ]);
    console.log('STCVaultPoolA::current_fai_supply', result);
    return result;
  } catch (e) {
    return e;
  }
};

// ===================================== GET MAX BORROW LIMIT OF FAI =====================================
export const getMaxBorrowLimitOfFai = async (address) => {
  try {
    const [result] = await requestChain('contract.call_v2', [
      {
        function_id: `${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::max_borrow`,
        args: [address],
        type_args: [],
      },
    ]);
    console.log('STCVaultPoolA::max_borrow', result);
    return result;
  } catch (e) {
    return e;
  }
};

// =====================================  GET VAULT CONFIG =====================================
export const getVaultConfig = async () => {
  try {
    const { json } = await requestChain('state.get_resource', [
      BFLY_CONTRACT_ADDRESS,
      `0x00000000000000000000000000000001::Config::Config<${BFLY_CONTRACT_ADDRESS}::Config::VaultPoolConfig<${BFLY_CONTRACT_ADDRESS}::STCVaultPoolA::VaultPool>>`,
      { decode: true },
    ]);
    console.log('STCVaultPoolA::VaultPoolConfig', json.payload);

    return json.payload || {};
  } catch (e) {
    return e;
  }
};

// ===================================== TRANSACTION  =====================================

// ===================================== BORROW FAI =====================================
export const createVault = () => {
  return TxnWrapper({
    functionId: `${BFLY_CONTRACT_ADDRESS}::MarketScript::create_vault`,
    typeTag: [],
    params: [],
  });
};

// ===================================== DEPOSIT FAI =====================================
export const depositFai = (amount) => {
  return TxnWrapper({
    functionId: `${BFLY_CONTRACT_ADDRESS}::MarketScript::deposit`,
    typeTag: [],
    params: [amount],
  });
};

// ===================================== WITHDRAW FAI =====================================
export const withdrawFai = (amount) => {
  return TxnWrapper({
    functionId: `${BFLY_CONTRACT_ADDRESS}::MarketScript::withdraw`,
    typeTag: [],
    params: [amount],
  });
};

// ===================================== MINT FAI =====================================
export const mintFai = (amount) => {
  return TxnWrapper({
    functionId: `${BFLY_CONTRACT_ADDRESS}::MarketScript::borrow_fai`,
    typeTag: [],
    params: [amount],
  });
};

// ===================================== REPAY FAI =====================================
export const repayFai = (amount) => {
  return TxnWrapper({
    functionId: `${BFLY_CONTRACT_ADDRESS}::MarketScript::repay_fai`,
    typeTag: [],
    params: [amount],
  });
};
