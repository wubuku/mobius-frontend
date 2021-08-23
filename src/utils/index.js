/**
 *  截断钱包账号
 */
export const shortCutOfAccountHash = (hash) => {
  return hash.replace(/^0x\w{4}(.*)\w{4}$/, (match, p1, offset, string) => {
    return string.replace(p1, '...');
  });
};

/**
 * hex to string
 */
export const hexToStr = (str) => {
  var hex = str.toString().replace(/^0x/, '');
  var ret = '';

  for (var n = 0; n < hex.length; n += 2) {
    ret += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return ret.toString();
};

/**
 * number to unit string like '100K or 1M'
 */
export const numberWithUnit = (num) => {
  var unit = ['', 'K', 'M', 'B'];
  var digit = Math.floor(Math.log(num) / Math.log(1000));
  return (num / Math.pow(1000, Math.floor(digit))).toFixed(3) + ' ' + unit[digit];
};

/**
 * Input number only
 */
export const numberInput = (value) => {
  return value
    .replace(/[^\d.]/g, '')
    .replace(/(^0)(\d+)/, '$2')
    .replace(/^(\.*)(\d+)(\.?)(\d{0,9}).*$/g, '$2$3$4');
};

/**
 * Token Struct to string
 */
export const toTokenString = ({ addr = '', module_name = '', name = '' }) => {
  if (!addr || !module_name || !name) return '';
  return `${addr}::${hexToStr(module_name)}::${hexToStr(name)}`;
};

export * from './Txn';
