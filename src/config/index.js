import { JsonProvider } from 'utils/TxnWrapper';
import BigNumber from 'bignumber.js';
import Enum from 'enums-js';

/**
 * Format Enum params
 */
export const ArrayToEnumParam = (array) => {
  if (Array.isArray(array)) {
    return array.map((item) => (typeof item === 'string' ? [item] : item));
  }
  return array;
};

// Dapp Contract Address
export const SOURCE_ADDRESS = '0x987Aa19F00dB14FE9B5C9271F3A7Ee0A'.toLocaleLowerCase();

// export const TEST_NETWORK = process.env.VUE_APP_TEST_CHAIN || '';
// export const TEST_NETWORK = 'https://barnard-seed.starcoin.org';
export const TEST_NETWORK = '';

export const BROWSER_URL_OF_TRANSACTION = (txn = '') =>
  txn
    ? `https://stcscan.io/${
        ENUMS.CHAIN_NAME[window.starcoin.networkVersion].value
      }/transactions/detail/${txn}`
    : '';

export const ToChainAmount = (amount, precision) => new BigNumber(amount).multipliedBy(precision);
export const ToHumanAmount = (amount, precision) => new BigNumber(amount).dividedBy(precision);

export const ENUMS = {
  // Tab Name Enum
  TAB_NAME: new Enum(...ArrayToEnumParam(['deposit', 'withdraw', 'borrow', 'repay'])),
  CHAIN_NAME: new Enum(
    ...ArrayToEnumParam([
      [1, 'main'],
      [251, 'barnard'],
      [253, 'halley'],
    ]),
  ),
  ROUTE_NAME: new Enum(
    ...ArrayToEnumParam([
      'BorrowHome',
      'BorrowResource',
      'BorrowDeposit',
      'BorrowLoan',
      'BorrowHistory',
    ]),
  ),
  LS_NAME: new Enum(...ArrayToEnumParam(['deposit_query', 'borrow_query'])),
};
