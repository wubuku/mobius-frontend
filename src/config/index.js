import { JsonProvider } from '@wormhole-stc/txn-wrapper';
import BigNumber from 'bignumber.js';

export const SOURCE_ADDRESS = '0x6a4d60e09c3d60d7260b1ca9a5e0cc4e';

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
