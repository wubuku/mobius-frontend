<template>
  <div class="app-home">
    <img src="../../assets/images/borrow/liuxing.png" class="liuxing" />

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

      <!-- <pre style="color: white">
        {{ tokenList[0] }}
      </pre> -->

      <div class="main">
        <div class="dashboard-box">
          <div class="my-info-box large">
            <div class="label benifit">XXXXXX</div>
            <div class="num large up blod">$12.32</div>
            <a-button disabled class="btn benifit-btn disabled">点击领取</a-button>
          </div>
          <div class="line">
            <div class="my-info-box">
              <div class="label">供应价值</div>
              <div class="num large my blod">${{ tokenList[0]?.totalBorrowingValueOnTheroy }}</div>
            </div>
            <div class="my-info-box">
              <div class="label">已借价值</div>
              <div class="num large my blod">${{ tokenList[0]?.totalBorrowedValueOnReal }}</div>
            </div>
            <div class="my-info-box flex credit-balance">
              <div class="label">
                <span>可用信用价值</span>
                <span class="progress">
                  <span class="title">借贷使用比例</span>
                  <a-progress :percent="parseFloat(tokenList[0]?.borrowedLimitUsed)" />
                </span>
              </div>
              <div class="num large my blod">${{ tokenList[0]?.restBorrowingValueOnReal }}</div>
            </div>
          </div>
        </div>

        <div class="markets">
          <div class="list">
            <h2>供应市场</h2>
            <!-- <pre style="color: white">
              {{ tokenList[0] }}
            </pre> -->
            <a-table
              :dataSource="tokenList"
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

              <!-- Supply -->
              <template #supply_balance="{ record }">
                {{ record.supplyBalance }}
                {{ record.name }}
              </template>

              <!-- wallet -->
              <template #wallet="{ record }">
                <div class="num my">
                  {{ record.walletResource }}
                  {{ record.name }}
                </div>
              </template>
            </a-table>
          </div>
          <div class="list">
            <!-- <pre style="color: white">
              {{ tokenList }}
            </pre> -->
            <h2>借贷市场</h2>

            <a-table
              :dataSource="tokenList"
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
              <template #borrowBalance="{ record }">
                {{ record.borrowBalance }}
                {{ record.name }}
              </template>
              <!-- 流通性 -->
              <template #liquidity="{ record }">
                {{ record.liquidity }}
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
  import useTable from 'uses/useTable';
  import useTransaction from 'uses/useTransaction';
  import useUser from 'uses/useUser';

  const emitter = inject('emitter');
  const { $i18n: i18n } = getCurrentInstance().appContext.config.globalProperties;
  const { tokenList, toHumanReadable, toPercent, getTokenList, toReadMantissa } = useToken();
  const { TokenColumnDeposit, TokenColumnBorrow } = useTable();
  const { accountHash, wallet } = useUser();

  const tableLoading = ref(false);
  const depositModalVisible = ref(false);
  const borrowModalVisible = ref(false);

  const modalToken = ref({});
  const dropdownFlag = computed(() => {
    const lang = i18n.locale;
    return require(`../../assets/locales/${lang}.svg`);
  });
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
      tableLoading.value = false;
    } catch (e) {
      console.log('init error', e);
    }
  };

  emitter.on('refreshData', () => {
    init();
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
