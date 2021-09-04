//No interest rate calculation needed
import BigNumber from 'bignumber.js';

// amount 
export const gain = (amount, index, user_index) => {
	let amount_b = new BigNumber(amount);
	let ret = amount_b.multipliedBy(index).dividedBy(user_index).minus(amount);

	return ret.toFixed(0);
};

export const interestLinear = (amount, index, user_index, rate, timestamp) => {
	let amount_b = new BigNumber(amount);
	let gain = amount_b.multipliedBy(index).dividedBy(user_index).minus(amount);
	let now = Date.now();
	const yearSecond = 31536000;
	const rateSecond = rate / yearSecond;
	const timeDelta = (now - timestamp) / 1000;
	if (timeDelta <= 0) {
		return gain.toFixed(0);
	}
	let inc = amount_b.multipliedBy(timeDelta).multipliedBy(rateSecond);
	let total = inc.plus(gain);
	return total.toFixed(0);
};