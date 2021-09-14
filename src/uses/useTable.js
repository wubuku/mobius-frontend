export default () => {
  return {
    TokenColumnDeposit: [
      {
        title: '资产',
        dataIndex: 'name',
        width: '135px',
        slots: {
          customRender: 'name',
        },
      },
      // {
      //   title: '存款市场',
      //   dataIndex: 'collateral_amount',
      //   width: '110px',
      //   sorter: (prev, next) => prev.collateral_amount - next.collateral_amount,
      //   slots: {
      //     customRender: 'collateral_amount',
      //   },
      // },
      {
        title: '存款APY',
        dataIndex: 'supplyAPY',
        key: 'supplyAPY',
        sorter: (prev, next) => prev.supplyAPY - next.supplyAPY,
      },
      {
        title: 'Supply',
        dataIndex: 'supply_balance',
        key: 'supply_balance',
        sorter: (prev, next) => prev.supply_balance - next.supply_balance,
        slots: {
          customRender: 'supply_balance',
        },
      },
      {
        title: '钱包',
        dataIndex: 'walletResource',
        sorter: (prev, next) => prev.walletResource - next.walletResource,
        slots: {
          customRender: 'wallet',
        },
      },
    ],

    TokenColumnBorrow: [
      {
        title: '资产',
        dataIndex: 'name',
        width: '135px',
        slots: {
          customRender: 'name',
        },
      },
      {
        title: '借款APY',
        dataIndex: 'borrowAPY',
        key: 'borrowAPY',
        sorter: (prev, next) => prev.borrowAPY - next.borrowAPY,
      },
      {
        title: '当前借款',
        dataIndex: 'borrowBalance',
        key: 'borrowBalance',
        sorter: (prev, next) => prev.borrowBalance - next.borrowBalance,
        slots: {
          customRender: 'borrowBalance',
        },
      },
      {
        title: 'LIQUIDITY',
        dataIndex: 'tokens.value',
        sorter: (prev, next) => prev.tokens.value - next.tokens.value,
        slots: {
          customRender: 'liquidity',
        },
      },
    ],
  };
};
