import { gain, interestLinear } from 'utils/Calc';
import { expect } from 'chai';

describe('gain', () => {
	it('gain', () => {
		expect(gain(1345600000000000, 1000000832382000000, 1000000000000000000)).to.eq('1120053219');
	});
  
	it('gain Failure', () => {
		expect(gain(1345600000000000, 1000000832000000000, 1000000000000000000)).to.eq(1);
	});
});

describe('interestLinear', () => {
	it('interestLinear', () => {
		let now = Date.now() - 1000000;
		expect(interestLinear(1345600000000000, 1000000832000000000, 1000000000000000000, 0.02625, now)).to.eq('2239592472');
	});
  
	it('interestLinear Failure', () => {
		let now = Date.now() - 1000000;
		expect(interestLinear(1345600000000000, 1000000832000000000, 1000000000000000000, 0.02625, now)).to.eq(1);
	});
});