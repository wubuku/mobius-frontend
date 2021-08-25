export default () => {
  return {
    TokenColumn: [
      {
        title: '资产',
        dataIndex: 'name',
      },
      {
        title: '存款市场',
        dataIndex: 'age',
        width: '110px',
        sorter: true,
      },
      {
        title: '存款APY',
        dataIndex: 'token_risk_params.deposit_apy.mantissa',
        sorter: true,
      },
      {
        title: '借款市场',
        dataIndex: 'name1',
        width: '110px',
        sorter: true,
      },
      {
        title: '借款APY',
        dataIndex: 'token_risk_params.borrow_apy.mantissa',
        sorter: true,
      },
      {
        title: '剩余可借',
        dataIndex: 'liquidity',
        width: '110px',
        sorter: true,
        slots: {
          customRender: 'liquidity',
        },
      },
      {
        title: '操作',
        key: 'action',
        slots: {
          customRender: 'action',
        },
      },
    ],

    CollateralColumn: [
      {
        title: '你的存款',
        dataIndex: 'name',
      },
      {
        title: '当前余额',
        key: 'amount',
        slots: {
          customRender: 'amount',
        },
      },
      {
        title: '年收益率',
        dataIndex: 'rate',
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        slots: {
          customRender: 'action',
        },
      },
    ],

    DebtColumn: [
      {
        title: '资产',
        dataIndex: 'name',
      },
      {
        title: '借款数量',
        key: 'amount',
        slots: {
          customRender: 'amount',
        },
      },
      {
        title: '借款APY',
        dataIndex: 'rate',
      },
      {
        title: '清算价格',
        dataIndex: 'price',
      },
      {
        title: 'CCR',
        dataIndex: 'ccr',
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        slots: {
          customRender: 'action',
        },
      },
    ],

    HistoryColumn: [
      {
        title: '时间',
        dataIndex: 'createdAtStr',
        width: '200px',
      },
      {
        title: '操作',
        dataIndex: 'oper',
      },
      {
        title: '资产',
        dataIndex: 'name',
      },
      {
        title: '数量',
        dataIndex: 'amount',
      },
      {
        title: '查看详情',
        slots: {
          customRender: 'detail',
        },
      },
    ],
  };
};
