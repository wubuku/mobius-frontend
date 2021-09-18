export default (t) => {
  return {
    TokenColumnDeposit: [
      {
        title: t('borrow.home.table.column.asset'),
        dataIndex: 'name',
        width: '135px',
        slots: {
          customRender: 'name',
        },
      },
      {
        title: t('borrow.home.table.column.supplyAPY'),
        dataIndex: 'supplyAPY',
        key: 'supplyAPY',
        sorter: (prev, next) => prev.supplyAPY - next.supplyAPY,
      },
      {
        title: t('borrow.home.table.column.supplyBalance'),
        dataIndex: 'supply_balance',
        key: 'supply_balance',
        sorter: (prev, next) => prev.supplyBalance - next.supplyBalance,
        slots: {
          customRender: 'supply_balance',
        },
      },
      {
        title: t('borrow.home.table.column.wallet'),
        dataIndex: 'walletResource',
        sorter: (prev, next) => prev.walletResource - next.walletResource,
        slots: {
          customRender: 'wallet',
        },
      },
    ],

    TokenColumnBorrow: [
      {
        title: t('borrow.home.table.column.asset'),
        dataIndex: 'name',
        width: '135px',
        slots: {
          customRender: 'name',
        },
      },
      {
        title: t('borrow.home.table.column.borrowAPY'),
        dataIndex: 'borrowAPY',
        key: 'borrowAPY',
        sorter: (prev, next) => prev.borrowAPY - next.borrowAPY,
      },
      {
        title: t('borrow.home.table.column.borrowBalance'),
        dataIndex: 'borrowBalance',
        key: 'borrowBalance',
        sorter: (prev, next) => prev.borrowBalance - next.borrowBalance,
        slots: {
          customRender: 'borrowBalance',
        },
      },
      {
        title: t('borrow.home.table.column.liquidity'),
        dataIndex: 'tokens.value',
        sorter: (prev, next) => prev.tokens.value - next.tokens.value,
        slots: {
          customRender: 'liquidity',
        },
      },
    ],
  };
};
