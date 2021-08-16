<template>
  <div class="b-resource">
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

    <p>Table</p>
    <p>Table</p>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import AssetNumber from 'comp/Borrow/AssetNumber';

  export default defineComponent({
    props: {},
    components: {
      AssetNumber,
    },
    setup() {
      const reward = 11.1;
      const unit = 'USDT';

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

      return {
        reward,
        unit,
        option,
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
</style>
