import { gain, interestLinear, APYUser, debtValue, ltvAvg } from 'utils/Calc';
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

describe('APYUser', () => {
	it('APYUser', () => {
		
		let tokenPrice = {'STC': 0.167, 'METH': 4231.21, 'MBTC': 48321.2345, 'MUSDT': 1};
		let tokenList = {'STC': 188.8784, 'METH': 20.5, 'MBTC': 2.2, 'MUSDT': 7500};
		let tokenBorrowAPY = {'STC': 0.2284, 'METH': 0.05, 'MBTC': 0.2, 'MUSDT': 0.003};
		expect(APYUser(tokenPrice, tokenList, tokenBorrowAPY)).to.eq(0.12);
	});
  
});

describe('debtValue', () => {
	it('debtValue', () => {
		
		let tokenPrice = {'STC': 0.167, 'METH': 4231.21, 'MBTC': 48321.2345, 'MUSDT': 1};
		let tokenList = {'STC': 188.8784, 'METH': 20.5, 'MBTC': 2.2, 'MUSDT': 7500};
		expect(debtValue(tokenPrice, tokenList)).to.eq(0.12);
	});
  
});

describe('ltvAvg', () => {
	it('debtValue', () => {
		
		let tokenPrice = {'STC': 0.167, 'METH': 4231.21, 'MBTC': 48321.2345, 'MUSDT': 1};
		let tokenList = {'STC': 188.8784, 'METH': 20.5, 'MBTC': 2.2, 'MUSDT': 7500};
		let tokenLtvList = {'STC': 0.2284, 'METH': 0.05, 'MBTC': 0.2, 'MUSDT': 0.003};
		expect(ltvAvg(tokenPrice, tokenList, tokenLtvList)).to.eq(0.12);
	});
  
});