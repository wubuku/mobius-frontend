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
          <div class="btn primary">{{ $t('borrow.home.main.borrowNow') }}</div>
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

      <div class="table-title">
        <span>所有资产</span>
      </div>
      <a-table :dataSource="tokenList" :columns="TokenColumn" :pagination="false">
        <template #action="{ record }">
          <div class="action-btn-box">
            <a-button class="btn">{{ record.name }}</a-button>
            <a-button danger class="btn">{{ record.name }}</a-button>
          </div>
        </template>
      </a-table>
    </div>

    <div class="empty" v-if="false">
      <img src="../../assets/images/borrow/no-resource.png" />
      <p>{{ $t('borrow.home.tips') }}</p>
      <div class="btn primary">{{ $t('borrow.btn.depositnow') }}</div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import LabelNumber from 'comp/Borrow/LabelNumber';
  import useToken from '../../uses/useToken';
  import useTable from '../../uses/useTable';

  export default defineComponent({
    props: {},
    components: {
      LabelNumber,
    },
    setup() {
      const { t } = useI18n();
      const { tokenList } = useToken();
      const { TokenColumn } = useTable();
      console.log(tokenList);

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

      return {
        option,
        tokenList,
        TokenColumn,
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
  }
</style>
