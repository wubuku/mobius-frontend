export default () => {
  return {
    TokenColumn: [
      {
        title: '资产',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
      },
      {
        title: '存款市场',
        dataIndex: 'age',
        key: 'age',
        width: '110px',
        sorter: true,
      },
      {
        title: '存款APY',
        dataIndex: 'token_risk_params.deposit_apy.mantissa',
        key: 'token_risk_params.deposit_apy.mantissa',
        sorter: true,
      },
      {
        title: '借款市场',
        dataIndex: 'name',
        key: 'name',
        width: '110px',
        sorter: true,
      },
      {
        title: '借款APY',
        dataIndex: 'token_risk_params.borrow_apy.mantissa',
        key: 'token_risk_params.borrow_apy.mantissa',
        sorter: true,
      },
      {
        title: '剩余可借',
        dataIndex: 'name',
        key: 'name',
        width: '110px',
        sorter: true,
      },
      {
        title: '操作',
        key: 'action',
        slots: {
          customRender: 'action',
        },
      },
    ],
  };
};
