<template>
  <div class="empty" v-if="hasNoAsset">
    <img src="../../assets/images/borrow/no-resource.png" />
    <p>{{ $t('borrow.home.tips') }}</p>
    <div
      class="btn primary"
      @click="deposit({ tab: 'deposit', address: '0x00000000000000000000000000000001::STC::STC' })"
    >
      {{ $t('borrow.btn.depositnow') }}
    </div>
  </div>

  <div class="b-resource" v-else>
    <!-- top -->
    <div class="top">
      <div class="reward">
        <span class="title">累计利息：</span>
        <span>{{ reward }} {{ unit }}</span>
        <div class="btn">提取</div>
      </div>

      <div class="btn bell">设置提醒</div>
    </div>

    <!-- Datas -->
    <div class="datas">
      <div class="left">
        <asset-number title="存款余额" :value="1000" unit="EHT"></asset-number>
      </div>
      <div class="center">
        <div class="chart-box">
          <v-chart :option="option"></v-chart>
        </div>
      </div>
      <div class="right">
        <asset-number title="贷款余额" :value="1000" unit="DAI"></asset-number>
      </div>
    </div>

    <a-progress :percent="30">
      <template #format="percent">
        <span>
          Utilization:
          {{ percent }}%
        </span>
      </template>
    </a-progress>

    <div class="table-panel">
      <h2 class="table-head">存款信息</h2>
      <a-table
        :dataSource="collateralList"
        :columns="CollateralColumn"
        :pagination="false"
        row-key="address"
      >
        <template #amount="{ record }">
          <span>
            {{
              toHumanReadable({
                address: record.address,
                amount: record.token_amount,
              })
            }}
          </span>
        </template>
        <template #action="{ record }">
          <div class="action-btn-box">
            <a-button class="btn" @click="deposit({ tab: 'deposit', address: record.address })">
              存款
            </a-button>
            <a-button class="btn" @click="deposit({ tab: 'withdraw', address: record.address })">
              取款
            </a-button>
          </div>
        </template>
      </a-table>
    </div>
    <p>取款和还款 如果是全部的话, 要传0</p>
    <div class="table-panel">
      <h2 class="table-head">贷款信息</h2>
      <a-table :dataSource="debtList" :columns="DebtColumn" :pagination="false" row-key="address">
        <template #amount="{ record }">
          <span>
            {{
              toHumanReadable({
                address: record.address,
                amount: record.token_amount,
              })
            }}
          </span>
        </template>
        <template #action="{}">
          <div class="action-btn-box">
            <a-button class="btn">借款</a-button>
            <a-button class="btn">还款</a-button>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, watch, onMounted, inject } from 'vue';
  import { useRouter } from 'vue-router';

  import AssetNumber from 'comp/Borrow/AssetNumber';

  import useUser from 'uses/useUser';
  import useTable from 'uses/useTable';
  import useToken from 'uses/useToken';

  export default defineComponent({
    props: {},
    components: {
      AssetNumber,
    },
    setup() {
      const reward = 11.1;
      const unit = 'USDT';

      const { accountHash, collateralList, debtList, hasNoAsset } = useUser();
      const { CollateralColumn, DebtColumn } = useTable();
      const { toHumanReadable } = useToken();
      const ENUMS = inject('ENUMS');
      const router = useRouter();

      const option = ref({
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
              },
            },
            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
            ],
          },
        ],
      });

      // method
      const deposit = (query) => {
        router.push({
          name: ENUMS.ROUTE_NAME.BORROWDEPOSIT.value,
          query,
        });
      };

      return {
        reward,
        unit,
        option,
        CollateralColumn,
        DebtColumn,

        collateralList,
        debtList,
        hasNoAsset,
        ENUMS,

        toHumanReadable,

        deposit,
      };
    },
  });
</script>

<style lang="less" scoped>
  .b-resource {
    .top {
      display: flex;
      margin-bottom: 30px;

      .reward {
        display: flex;
        width: 395px;
        height: 35px;
        background: #f7f9fa;
        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.05);
        border-radius: 17.5px;
        padding: 0 0 0 30px;
        align-items: center;
        font-size: 18px;
        color: #4b4d51;

        .title {
          padding-right: 30px;
        }

        .btn {
          width: 87px;
          height: 37px;
          background-color: rgba(#9ca5b3, 0.3);
          border-radius: 17.5px;
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .datas {
      display: flex;

      .left,
      .center,
      .right {
        display: flex;
        height: 265px;
        align-items: center;
        justify-content: center;
      }

      .center {
        flex: 1;
      }

      .chart-box {
        width: 265px;
        height: 265px;
      }
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 200px;
    color: #51afc6;

    img {
      width: 256px;
      margin-bottom: 70px;
    }

    p {
      margin-bottom: 30px;
    }
  }
</style>
