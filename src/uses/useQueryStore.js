import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ENUMS } from 'config';

const { LS_NAME } = ENUMS;

export default () => {
  const route = useRoute();
  const router = useRouter();

  const mode = ref('');
  const amount = ref('');
  const pageType = ref('');
  const selectedToken = ref({});
  const lsAddress = ref('');

  const lsNameCurrent = computed(() => LS_NAME[`${pageType.value}_QUERY`]);

  const isDepositMode = computed(() => mode.value === ENUMS.TAB_NAME.DEPOSIT.value);
  const isWithdrawMode = computed(() => mode.value === ENUMS.TAB_NAME.WITHDRAW.value);
  const isBorrowMode = computed(() => mode.value === ENUMS.TAB_NAME.BORROW.value);
  const isRepayMode = computed(() => mode.value === ENUMS.TAB_NAME.REPAY.value);

  watch(mode, () => {
    const queryStr = window.localStorage.getItem(LS_NAME.value);
    let tab = '';
    let address = selectedToken.value.address;

    if (queryStr) {
      const query = JSON.parse(queryStr);
      tab = query.tab;
      address = query.address;
    }

    window.localStorage.setItem(
      LS_NAME.value,
      JSON.stringify({
        tab: mode.value,
        address,
      }),
    );

    amount.value = '';
  });

  const tokenListWatchHandler = ({ tokenList }) => {
    if (selectedToken.value.address) return;
    selectedToken.value =
      tokenList.value.find((item) => item.address === lsAddress.value) || tokenList.value[0] || {};
  };

  return {
    mode,
    amount,
    selectedToken,
    pageType,
    isDepositMode,
    isWithdrawMode,
    isBorrowMode,
    isRepayMode,

    parseQuery: ({ type = '', tokenList = [] }) => {
      mode.value = ENUMS.TAB_NAME[type].value;
      pageType.value = type;

      let { tab, address = ENUMS.TAB_NAME[pageType.value].value } = route.query;
      if (tab && address) {
        window.localStorage.setItem(lsNameCurrent.value, JSON.stringify(route.query));
        router.replace({ name: ENUMS.ROUTE_NAME.BORROWLOAN.value, query: {} });
      } else if (window.localStorage.getItem(lsNameCurrent.value)) {
        const query = JSON.parse(window.localStorage.getItem(lsNameCurrent.value));
        tab = query.tab;
        address = query.address;
      }

      lsAddress.value = address;
      mode.value = tab || ENUMS.TAB_NAME[pageType.value].value;

      if (tokenList.value) {
        tokenListWatchHandler({ tokenList });
      }
    },

    selectedTokenWatchHandler: ({ accountHash }) => {
      if (!selectedToken.value.name || !accountHash.value) return;

      window.localStorage.setItem(
        lsNameCurrent.value,
        JSON.stringify({
          tab: mode.value,
          address: selectedToken.value.address,
        }),
      );
    },

    tokenListWatchHandler,
  };
};
