<template>
  <div class="app-home">
    <div class="app-container">
      <div class="app-header">
        <div class="logo">
          <router-link :to="{ name: 'Home' }">BFLY.FINANCE</router-link>
        </div>
        <div class="collect-box">
          <connect-btn></connect-btn>
          <locale-switch></locale-switch>
        </div>
      </div>

      <!-- <pre style="color: white">
        {{ tokenList[0] }}
      </pre> -->

      <div class="main">
        <div class="dashboard-box">
          <div class="my-info-box large">
            <div class="label benifit">{{ $t('borrow.home.data.availableRewards') }}</div>
            <div class="num large up blod">$12.32</div>
            <a-button disabled class="btn benifit-btn disabled">
              {{ $t('borrow.btn.claim') }}
            </a-button>
          </div>
          <div class="line">
            <div class="my-info-box">
              <div class="label">{{ $t('borrow.home.data.supplyBalance') }}</div>
              <div class="num large my blod">${{ tokenList[0]?.totalCanBorrowUSDOnTheroy }}</div>
            </div>
            <div class="my-info-box">
              <div class="label">{{ $t('borrow.home.data.borrowBalance') }}</div>
              <div class="num large my blod">${{ tokenList[0]?.totalBorrowedUSDOnReal }}</div>
            </div>
            <div class="my-info-box flex credit-balance">
              <div class="label">
                <span class="text">{{ $t('borrow.home.data.borrowLimit') }}</span>
                <span class="progress">
                  <span class="title">{{ $t('borrow.home.data.borrowRate') }}</span>
                  <a-progress :percent="parseFloat(tokenList[0]?.borrowedLimitUsed)" />
                </span>
              </div>
              <div class="num large my blod">${{ tokenList[0]?.restBorrowingValueOnReal }}</div>
            </div>
          </div>
        </div>

        <div class="markets">
          <div class="list">
            <h2>{{ $t('borrow.home.table.supplyMarket') }}</h2>
            <!-- <pre style="color: white">
              {{ tokenList[0] }}
            </pre> -->
            <a-table
              :dataSource="tokenList"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :locale="{ emptyText: '' }"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('deposit', record)"
            >
              <!-- 资产 -->
              <a-table-column
                key="name"
                :title="$t('borrow.home.table.column.asset')"
                data-index="name"
                width="135px"
              >
                <template #default="{ record }">
                  <div class="coin">
                    <img :src="CoinIcon(record.name)" class="coin-icon" />
                    {{ record.name }}
                  </div>
                </template>
              </a-table-column>
              <!-- Supply -->
              <a-table-column
                key="supplyAPY"
                :title="$t('borrow.home.table.column.supplyAPY')"
                data-index="supplyAPY"
              ></a-table-column>
              <a-table-column
                key="supply_balance"
                :title="$t('borrow.home.table.column.supplyBalance')"
                data-index="supply_balance"
              >
                <template #default="{ record }">
                  {{ record.supplyBalance }}
                  {{ record.name }}
                </template>
              </a-table-column>
              <!-- wallet -->
              <a-table-column
                key="walletResource"
                :title="$t('borrow.home.table.column.wallet')"
                data-index="walletResource"
              >
                <template #default="{ record }">
                  <div class="num my">
                    {{ record.walletResource }}
                    {{ record.name }}
                  </div>
                </template>
              </a-table-column>
            </a-table>
          </div>
          <div class="list">
            <!-- <pre style="color: white">
              {{ tokenList }}
            </pre> -->
            <h2>{{ $t('borrow.home.table.borrowMarket') }}</h2>

            <a-table
              :dataSource="tokenList"
              :pagination="false"
              :rowKey="(record) => record.dataIndex"
              :loading="tableLoading"
              :customRow="(record) => tableEventHandler('borrow', record)"
            >
              <!-- 资产 -->
              <a-table-column
                key="name"
                :title="$t('borrow.home.table.column.asset')"
                data-index="name"
                width="135px"
              >
                <template #default="{ record }">
                  <div class="coin">
                    <img :src="CoinIcon(record.name)" class="coin-icon" />
                    {{ record.name }}
                  </div>
                </template>
              </a-table-column>

              <!-- Supply -->
              <a-table-column
                key="supplyAPY"
                :title="$t('borrow.home.table.column.borrowAPY')"
                data-index="borrowAPY"
              ></a-table-column>

              <!-- 当前借款 -->
              <a-table-column
                key="borrowBalance"
                :title="$t('borrow.home.table.column.borrowBalance')"
                data-index="borrowBalance"
              >
                <template #default="{ record }">
                  {{ record.borrowBalance }}
                  {{ record.name }}
                </template>
              </a-table-column>

              <!-- 流通性 -->
              <a-table-column
                key="liquidity"
                :title="$t('borrow.home.table.column.liquidity')"
                data-index="liquidity"
              >
                <template #default="{ record }">
                  {{ record.liquidity }}
                  {{ record.name }}
                </template>
              </a-table-column>
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

<script setup>
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
  import useTransaction from 'uses/useTransaction';
  import useUser from 'uses/useUser';
  import { useRoute } from 'vue-router';

  import LocaleSwitch from 'comp/LocaleSwitch.vue';

  const emitter = inject('emitter');
  const { tokenList, toHumanReadable, toPercent, getTokenList, toReadableMantissa } = useToken();
  const { accountHash, wallet } = useUser();
  const route = useRoute();

  const tableLoading = ref(false);
  const depositModalVisible = ref(false);
  const borrowModalVisible = ref(false);

  const dataRefreshTime = ref(0);
  const refreshInterval = 60 * 1000;

  const modalToken = ref({});

  const CoinIcon = (tokenName) => {
    return require(`../../assets/images/coin/${tokenName.toLowerCase()}.png`);
  };

  onMounted(async () => {
    init();
  });

  watch(accountHash, () => {
    init();
  });

  const init = async () => {
    try {
      await getTokenList();
      openQueryToken();
      tableLoading.value = false;
      // Update data fresh time
      dataRefreshTime.value = Date.now();
    } catch (e) {
      console.log('init error', e);
    }
  };

  emitter.on('refreshData', () => {
    init();
  });

  emitter.on('refreshDataOnDuration', () => {
    if (Date.now() - dataRefreshTime.value > refreshInterval) {
      init();
    }
  });

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

  const openQueryToken = () => {
    if (depositModalVisible.value) return;
    if (!route.query.token || tokenList.value.length == 0) return;

    const queryToken = tokenList.value.filter((record) => record.name === route.query.token);
    if (queryToken.length === 0) return;

    modalToken.value = queryToken[0];
    depositModalVisible.value = true;
  };
</script>

<style lang="less">
  @import '../../assets/style/app.less';

  .main {
    width: 100%;
    margin-top: 1.75rem;
  }
</style>
