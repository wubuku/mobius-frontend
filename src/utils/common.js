export const tokenRate = (tokenPrice, tokenList) => {
	let totalValue = 0;
	let rate = Object.create({});
	Object.keys(tokenPrice).map((token) => {
		if (token in tokenList) {
			totalValue = totalValue + tokenPrice[token] * tokenList[token];
		}
	})
	Object.keys(tokenPrice).map((token) => {
		if (token in tokenList) {
			rate[token] = tokenPrice[token] * tokenList[token] / totalValue;
		} else {
			rate[token] = 0;
		}
	})
	return rate;
};	