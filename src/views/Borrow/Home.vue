<template>
  <div class="borrow-home">
    <div class="main">
      <h2>{{ $t('borrow.home.depositTitle') }}</h2>
      <div class="overview">
        <div class="left">
          <label-number
            :label="$t('borrow.home.main.nowBorrow')"
            value="1000"
            unit="USDT"
          ></label-number>
          <label-number
            :label="$t('borrow.home.main.averageMortgageRate')"
            value="200%"
          ></label-number>
        </div>
        <div class="center">
          <div class="chart-box">
            <v-chart :option="option"></v-chart>
          </div>
          <div class="btn primary borrow-btn" @click="goDeposit">
            {{ $t('borrow.home.main.borrowNow') }}
          </div>
        </div>
        <div class="right">
          <label-number :label="$t('borrow.home.main.borrowAPY')" value="9.6%"></label-number>
          <label-number
            :label="$t('borrow.home.main.mortgareValue')"
            value="2000"
            unit="USDT"
          ></label-number>
        </div>
      </div>

      <div class="table-panel">
        <div class="table-title">
          <span>所有资产</span>
        </div>
        <!-- <pre>{{ tokenList }}</pre> -->
        <a-table
          :dataSource="tokenList"
          :columns="TokenColumn"
          :pagination="false"
          :rowKey="(record) => record.dataIndex"
        >
          <template #liquidity="{ record }">
            {{
              numberWithUnit(
                toHumanReadable({
                  tokenName: record.name,
                  amount: record.tokens.value,
                }),
              )
            }}
          </template>
          <template #action="{ record }">
            <div class="action-btn-box">
              <a-button
                class="btn"
                @click="
                  jump({
                    name: 'BorrowDeposit',
                    query: { tab: 'deposit', tokenName: record.address },
                  })
                "
              >
                {{ $t('borrow.btn.deposit') }}
              </a-button>
              <a-button
                danger
                class="btn"
                @click="jump({ name: 'BorrowLoan', query: { tab: '', tokenName: record.address } })"
              >
                {{ $t('borrow.btn.borrow') }}
              </a-button>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import LabelNumber from 'comp/Borrow/LabelNumber';

  import useToken from 'uses/useToken';
  import useTable from 'uses/useTable';
  import useUser from 'uses/useUser';

  import { GetPersonalAssets, GetPersonalVoucher, GetTokenAssetId } from 'service/InitService';
  import { numberWithUnit } from 'utils';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    props: {},
    components: {
      LabelNumber,
    },
    setup() {
      const { t } = useI18n();
      const router = useRouter();
      const { tokenList, toHumanReadable } = useToken();
      const { TokenColumn } = useTable();
      const { accountHash, setPersonalAssets } = useUser();

      const option = ref({
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: t('borrow.home.depositTitle'),
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

      const goDeposit = () => {
        router.push({ name: 'BorrowDeposit' });
      };

      const jump = ({ name = '', query = {} }) => {
        router.push({ name, query });
      };

      const modelShow = ref(true);

      return {
        option,
        tokenList,
        TokenColumn,
        modelShow,

        goDeposit,
        jump,
        toHumanReadable,
        numberWithUnit,
      };
    },
  });
</script>

<style lang="less" scoped>
  .borrow-home {
    .main {
      width: 100%;
      display: flex;
      flex-direction: column;

      h2 {
        font-size: 26px;
        line-height: 30px;
        color: #51afc6;
        text-align: center;
        margin: 45px 0;
      }

      .overview {
        display: flex;

        .left,
        .center,
        .right {
          display: flex;
          flex-direction: column;
        }

        .left,
        .right {
          width: 250px;
          flex-shrink: none;
        }

        .center {
          flex: 1;
          justify-content: center;
          align-items: center;
        }

        .chart-box {
          width: 265px;
          height: 265px;
          margin-top: -40px;
        }

        .borrow-btn {
          background: #e5659b;
        }
      }
    }
  }
</style>
