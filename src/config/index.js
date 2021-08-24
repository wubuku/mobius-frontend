import { JsonProvider } from '@wormhole-stc/txn-wrapper';
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
export const SOURCE_ADDRESS = '0xd2db690120eef1644641ff37fd927b73';

// export const TEST_NETWORK = process.env.VUE_APP_TEST_CHAIN || '';
export const TEST_NETWORK = '';

export const BROWSER_URL_OF_TRANCATION = async (txn) => {
  try {
    const { name } = await JsonProvider(TEST_NETWORK).detectNetwork();
    return `https://stcscan.io/${name}/transactions/detail/${txn}`;
  } catch (err) {
    return '';
  }
};

export const ToChainAmount = (amount, precision) =>
  new BigNumber(amount).multipliedBy(precision).toString();
export const ToHumanAmount = (amount, precision) =>
  new BigNumber(amount).dividedBy(precision).toString();

export const ENUMS = {
  // Tab Name Enum
  TAB_NAME: new Enum(...ArrayToEnumParam(['deposit', 'withdraw', 'borrow', 'repay'])),
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
