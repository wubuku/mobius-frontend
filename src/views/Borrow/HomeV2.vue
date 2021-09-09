<template>
  <div class="app-home">
    <div class="app-container">
      <div class="app-header">
        <router-link :to="{ name: 'Home' }">
          <img src="../../assets/images/logo.png" class="logo" />
        </router-link>
      </div>

      <div class="main">
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

        <div class="dashboard-box">
          <div class="main-data">
            <div class="data-box">
              <div class="account-status">
                <h2>Supply Balance</h2>
                <p>$0</p>
              </div>
              <div class="account-status small">
                <h2>Venus Earned</h2>
                <p>$0</p>
              </div>
            </div>

            <div class="circle">
              <p>$0</p>
              <p class="desc">
                <span>ESTIMATED</span>
                <span>DAILY EARNINGS</span>
              </p>
            </div>

            <div class="data-box">
              <div class="account-status">
                <h2>Borrow Balance</h2>
                <p>$0</p>
              </div>
              <div class="account-status small">
                <h2>Net APY</h2>
                <p>$0</p>
              </div>
            </div>
          </div>

          <div class="summary-data">
            <div class="summary-data-item">
              <p class="big-number-price">$0</p>
              <p class="small-title">Available Credit</p>
            </div>

            <div class="summary-data-item right">
              <p class="big-number-price">$0</p>
              <p class="small-title">Available Credit</p>
            </div>
          </div>
        </div>

        <div class="markets">
          <div class="list">
            <h2>供应市场</h2>
            <a-table
              :dataSource="tokenListWithResource"
              :columns="TokenColumnDeposit"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :locale="{ emptyText: '' }"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('deposit', record)"
            >
              <template #name="{ record }">
                <div class="coin">
                  <img :src="CoinIcon(record.name)" class="coin-icon" />
                  {{ record.name }}
                </div>
              </template>
              <template #collateral_amount="{ record }">
                {{ record.collateral_amount }}
              </template>

              <template #collateral="{ record }">
                {{ record.collateral || 0 }} {{ record.name }}
              </template>

              <template #supply_rate="{ record }">
                {{
                  toPercent(
                    toHumanReadable({
                      address: record.address,
                      amount: record.supply_rate.mantissa,
                    }),
                  )
                }}
              </template>

              <template #wallet="{ record }">
                {{ toPrecision(wallet[record.name]?.amount) }}
                {{ record.name }}
              </template>
            </a-table>
          </div>
          <div class="list">
            <h2>借贷市场</h2>
            <a-table
              :dataSource="tokenListWithResource"
              :columns="TokenColumnBorrow"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('borrow', record)"
            >
              <template #name="{ record }">
                <div class="coin">
                  <img :src="CoinIcon(record.name)" class="coin-icon" />
                  {{ record.name }}
                </div>
              </template>
              <template #borrow_rate="{ record }">
                {{
                  toPercent(
                    toHumanReadable({
                      address: record.address,
                      amount: record.borrow_rate.mantissa,
                    }),
                  )
                }}
              </template>
              <template #debt="{ record }">{{ record.debt || 0 }} {{ record.name }}</template>
              <template #liquidity="{ record }">
                {{
                  numberWithUnit(
                    toHumanReadable({
                      address: record.address,
                      amount: record.tokens.value,
                    }),
                  )
                }}
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
      const { tokenList, toHumanReadable, toPercent, toPrecision, getTokenList } = useToken();
      const { TokenColumnDeposit, TokenColumnBorrow } = useTable();
      const { startTransactionCheck } = useTransaction();
      const { collateral, debt, wallet, getPersonalAssets } = useUser();

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

      const stopEffect = watchEffect(
        () => {
          tokenListWithResource.value = tokenList.value.map((token) => {
            return {
              ...token,
              walletResource: wallet.value[token.name]?.amount || 0,
              collateral: collateral.value[token.name]?.amount || 0,
              debt: debt.value[token.name]?.amount || 0,
            };
          });
        },
        { flush: 'sync' },
      );

      onMounted(async () => {
        try {
          startTransactionCheck();
          getPersonalAssets();
          await getTokenList();
          tableLoading.value = false;
        } catch (e) {
          console.log(e);
        }
      });

      const switchLanguage = (locale) => {
        i18n.locale = locale;
        window.localStorage.setItem('locale', i18n.locale);
      };

      const tableEventHandler = (type, record) => {
        return {
          onClick: () => {
            console.log(type);
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
        toPrecision,
        switchLanguage,
      };
    },
  });
</script>

<style lang="less" scoped>
  .app-home {
    width: 100%;
    min-height: 100vh;
    background-color: rgb(9, 13, 39);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;

    .app-container {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;

      .app-header {
        width: 100%;
        height: 84px;
        border-radius: 10px;
        background-color: #303456;
        align-items: center;
        display: flex;
        padding: 0 2.5rem;

        .logo {
          width: 200px;
        }
      }

      .main {
        width: 100%;
        margin-top: 1.75rem;

        .collect-box {
          display: flex;
          justify-content: flex-end;
          margin: 10px 0 40px;
          align-items: center;
          .account-btn {
            flex-shrink: 0;
          }

          .dropdown-placeholder {
            height: 100%;
          }
        }

        .dashboard-box {
          display: flex;
          flex-direction: column;
          margin: 0 auto;

          width: 100%;
          max-width: 800px;
          height: 300px;

          .main-data {
            width: 100%;
            display: flex;
            justify-content: space-between;

            p {
              margin-bottom: 0;
            }
          }

          .circle {
            width: 128px;
            height: 128px;
            border: 2px solid rgb(245, 158, 11);
            border-radius: 50%;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;

            p {
              font-size: 20px;
              margin-bottom: 3px;
              font-weight: bold;
            }

            .desc {
              font-size: 12px;
              font-weight: normal;
              span {
                display: block;
              }
            }
          }

          .summary-data {
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            position: relative;

            &:before {
              content: '';
              display: block;
              width: 100%;
              height: 0;
              position: absolute;
              border-top: 1px solid rgb(37, 42, 74);
              top: 75px;
            }

            .summary-data-item {
              &.right {
                text-align: right;
              }
            }
          }
        }

        .markets {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;

          h2 {
            margin: 0;
          }

          .coin {
            display: flex;
            align-items: center;
            .coin-icon {
              width: 34px;
              height: 34px;
              margin-right: 10px;
            }
          }

          .list {
            width: 49%;
            background-color: #303456;
            border-radius: 10px;
            padding-bottom: 20px;
            h2 {
              color: white;
              padding: 1.5rem 15px;
            }
          }
        }

        @media (max-width: 1024px) {
          .markets {
            flex-direction: column;
            gap: 20px;
            .list {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .flag {
    width: 24px;
    height: 24px;
    margin: 5px 0;
    cursor: pointer;
  }

  .big-number-price {
    font-size: 24px;
  }

  .small-title {
    font-size: 12px;
    color: rgb(156, 163, 175);
  }

  .account-status {
    text-align: center;
    height: 90px;

    h2 {
      color: white;
      font-size: 18px;
    }

    p {
      .big-number-price;
    }

    &.small {
      h2 {
        .small-title;
      }

      p {
        font-size: 14px;
      }
    }
  }
</style>
