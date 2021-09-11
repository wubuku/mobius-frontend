<template>
  <div class="app-home">
    <div class="app-container">
      <div class="app-header">
        <div class="logo">BFLY.FINANCE</div>
        <div class="collect-box">
          <connect-btn></connect-btn>
          <a-dropdown placement="bottomRight" trigger="hover">
            <div class="dropdown-placeholder">
              <img :src="dropdownFlag" class="flag" />
            </div>
            <template #overlay>
              <a-menu @click="({ key }) => switchLanguage(key)">
                <a-menu-item key="en">
                  <img src="../../assets/locales/en.svg" class="flag" />
                </a-menu-item>
                <a-menu-item key="zh">
                  <img src="../../assets/locales/zh.svg" class="flag" />
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <div class="main">
        <div class="dashboard-box">
          <div class="my-info-box">
            <div class="label">预估当日收益</div>
            <div class="num large up blod">$12.32</div>
          </div>
          <div class="line">
            <div class="my-info-box">
              <div class="label">供应余额</div>
              <div class="num large my blod">$12.32</div>
            </div>
            <div class="my-info-box">
              <div class="label">借贷余额</div>
              <div class="num large my blod">$12.32</div>
            </div>
            <div class="my-info-box flex credit-balance">
              <div class="label">
                <span>可用信用额度</span>
                <span class="progress">
                  <span class="title">借贷限额</span>
                  <a-progress :percent="30" />
                </span>
              </div>
              <div class="num large my blod">$12.32</div>
            </div>
          </div>
        </div>

        <div class="markets">
          <div class="list">
            <h2>供应市场</h2>
            <span style="color: white">
              <!-- {{ tokenListWithResource[0] }} -->
            </span>
            <a-table
              :dataSource="tokenListWithResource"
              :columns="TokenColumnDeposit"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :locale="{ emptyText: '' }"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('deposit', record)"
            >
              <!-- 资产 -->
              <template #name="{ record }">
                <div class="coin">
                  <img :src="CoinIcon(record.name)" class="coin-icon" />
                  {{ record.name }}
                </div>
              </template>
              <!-- 存款市场 -->
              <template #collateral_amount="{ record }">
                {{
                  toHumanReadable({
                    address: record.address,
                    amount: record.collateral_amount,
                  })
                }}
              </template>
              <!-- Supply APY -->
              <template #supply_rate="{ record }">
                {{ toPercent(toReadMantissa(record.supply_rate.mantissa)) }}
              </template>
              <!-- Supply -->
              <template #collateral="{ record }">
                {{
                  toFixed(
                    toHumanReadable({
                      address: record.address,
                      amount: record.collateral?.collateralAsset?.token_amount || 0,
                    }),
                  )
                }}
                {{ record.name }}
              </template>
              <!-- wallet -->
              <template #wallet="{ record }">
                <div class="num my">
                  {{ toFixed(wallet[record.name]?.amount) }}
                  {{ record.name }}
                </div>
              </template>
            </a-table>
          </div>
          <div class="list">
            <!-- <span style="color: white">
              {{ tokenListWithResource[0] }}
            </span> -->
            <h2>借贷市场</h2>

            <a-table
              :dataSource="tokenListWithResource"
              :columns="TokenColumnBorrow"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('borrow', record)"
            >
              <!-- 资产 -->
              <template #name="{ record }">
                <div class="coin">
                  <img :src="CoinIcon(record.name)" class="coin-icon" />
                  {{ record.name }}
                </div>
              </template>
              <!-- 借款利率 -->
              <template #borrow_rate="{ record }">
                {{ toPercent(toReadMantissa(record.borrow_rate.mantissa)) }}
              </template>
              <!-- 当前借款 -->
              <template #debt="{ record }">
                {{
                  toHumanReadable({
                    address: record.address,
                    amount: record.debt?.debtAsset?.token_amount || 0,
                  })
                }}
                {{ record.name }}
              </template>
              <!-- 流通性 -->
              <template #liquidity="{ record }">
                {{
                  numberWithUnit(
                    toHumanReadable({
                      address: record.address,
                      amount: record.tokens.value,
                    }),
                  )
                }}
                {{ record.name }}
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <deposit-modal
    v-model:visible="depositModalVisible"
    :token="modalToken"
    v-if="depositModalVisible"
  ></deposit-modal>

  <borrow-modal
    v-model:visible="borrowModalVisible"
    :token="modalToken"
    v-if="borrowModalVisible"
  ></borrow-modal>
</template>

<script>
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onMounted,
    ref,
    watch,
    watchEffect,
  } from 'vue';

  import ConnectBtn from 'comp/Borrow/ConnectBtn';
  import DepositModal from 'comp/Modal/Deposit';
  import BorrowModal from 'comp/Modal/Borrow';

  import { numberWithUnit } from 'utils';
  import useToken from 'uses/useToken';
  import useTable from 'uses/useTable';
  import useTransaction from 'uses/useTransaction';
  import useUser from 'uses/useUser';

  export default defineComponent({
    props: {},
    components: {
      ConnectBtn,
      DepositModal,
      BorrowModal,
    },
    setup() {
      const emitter = inject('emitter');
      const { $i18n: i18n } = getCurrentInstance().appContext.config.globalProperties;
      const {
        tokenList,
        toHumanReadable,
        toPercent,
        toFixed,
        getTokenList,
        toReadMantissa,
        getOracleValue,
      } = useToken();
      const { TokenColumnDeposit, TokenColumnBorrow } = useTable();
      const { startTransactionCheck } = useTransaction();
      const { accountHash, collateral, debt, wallet, getPersonalAssets } = useUser();

      const tableLoading = ref(false);
      const depositModalVisible = ref(false);
      const borrowModalVisible = ref(false);

      const modalToken = ref({});
      const tokenListWithResource = ref([]);
      const dropdownFlag = computed(() => {
        const lang = i18n.locale;
        return require(`../../assets/locales/${lang}.svg`);
      });
      const CoinIcon = (tokenName) => {
        return require(`../../assets/images/coin/${tokenName.toLowerCase()}.png`);
      };

      watchEffect(
        () => {
          tokenListWithResource.value = tokenList.value.map((token) => {
            return {
              ...token,
              walletResource: wallet.value[token.name]?.amount || 0,
              collateral: collateral.value[token.name] || {},
              debt: debt.value[token.name] || {},
            };
          });
        },
        { flush: 'sync' },
      );

      onMounted(async () => {
        init();
      });

      watch(accountHash, () => {
        init();
      });

      const init = async () => {
        try {
          getPersonalAssets();
          await getTokenList();
          tableLoading.value = false;
        } catch (e) {
          console.log('init error', e);
        }
      };

      emitter.on('getPersonalAssets', () => {
        getPersonalAssets();
      });

      const switchLanguage = (locale) => {
        i18n.locale = locale;
        window.localStorage.setItem('locale', i18n.locale);
      };

      const tableEventHandler = (type, record) => {
        return {
          onClick: () => {
            modalToken.value = { ...record };
            if (type === 'deposit') {
              depositModalVisible.value = true;
            } else if (type === 'borrow') {
              borrowModalVisible.value = true;
            }
          },
        };
      };

      return {
        tableLoading,
        tokenList,
        tokenListWithResource,
        wallet,
        TokenColumnDeposit,
        TokenColumnBorrow,
        dropdownFlag,

        depositModalVisible,
        borrowModalVisible,
        modalToken,

        CoinIcon,
        numberWithUnit,
        tableEventHandler,
        toHumanReadable,
        toPercent,
        toFixed,
        toReadMantissa,
        switchLanguage,
        getOracleValue,
      };
    },
  });
</script>

<style lang="less">
  @import '../../assets/style/app.less';

  .main {
    width: 100%;
    margin-top: 1.75rem;
  }

  .flag {
    width: 24px;
    height: 24px;
    margin: 5px 0;
    cursor: pointer;
  }
</style>
