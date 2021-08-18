import { JsonProvider } from '@wormhole-stc/txn-wrapper';

const SOURCE_ADDRESS = '0xf8af03DD08De49d81e4EFD9e24c039cc';

/**
 * Token List
 */
export const GetTokenList = () => {
  return JsonProvider().send('state.get_resource', [
    SOURCE_ADDRESS,
    `0x00000000000000000000000000000001::Config::Config<${SOURCE_ADDRESS}::Management::PositionConfig<${SOURCE_ADDRESS}::Management::StandardPosition>>`,
    { decode: true },
  ]);
};

/**
 * Single Token
 */
export const TokenStandardPosition = (token) => {
  return JsonProvider().send('state.get_resource', [
    SOURCE_ADDRESS,
    `${SOURCE_ADDRESS}::Treasury2::Position<${SOURCE_ADDRESS}::Management::StandardPosition, ${token}>`,
    { decode: true },
  ]);
};
