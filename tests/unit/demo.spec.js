import { expect } from 'chai';
import { APY } from 'utils/Calc';

describe('Rate', () => {
  it('XXX APY', () => {
    expect(APY(2, 2)).to.eq(0);
  });

  it('XXX APY Failure', () => {
    expect(APY(2, 2)).to.eq(1);
  });
});
