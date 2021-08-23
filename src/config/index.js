import { JsonProvider } from '@wormhole-stc/txn-wrapper';
export const SOURCE_ADDRESS = '0x9553fa700207336dd51ef8b0e4f5a2e7';

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
