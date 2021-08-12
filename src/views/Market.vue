<template>
  <div class="m-market">
    <div class="scale-banner">
      <div class="scale-item">
        <div class="scale-title">Scale Title</div>
        <div class="scale-number">
          $ 23,456,789,000.97
          <span class="trend-number">- 2.05 %</span>
        </div>
      </div>
      <div class="scale-item">
        <div class="scale-title">Scale Title</div>
        <div class="scale-number">
          $ 23,456,789,000.97
          <span class="trend-number up">- 2.05 %</span>
        </div>
      </div>
    </div>

    <div class="token-table">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :rowClassName="() => 'common-row'"
      >
        <template #opt="{ record }">
          <a-button @click="borrow(record)">存款</a-button>
          <a-button class="borrow" @click="borrow(record)">借款</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { MarketColumns } from 'config/TablesColumnConfig';

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: '$ 1.953M',
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: '$ 1.953M',
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: '$ 1.953M',
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  export default defineComponent({
    props: {},
    setup() {
      const { t } = useI18n();

      const borrow = (record) => {
        console.log(record);
      };

      return {
        data,
        columns: MarketColumns(t),

        borrow,
      };
    },
  });
</script>

<style lang="less" scoped>
  .m-market {
    display: flex;
    flex-direction: column;
    align-items: center;

    .scale-banner {
      width: 100%;
      height: 270px;
      display: flex;
      background-color: var(--bannerColor);
      font-family: kanit;
      justify-content: center;
      align-items: center;
      margin-bottom: 60px;

      .scale-item {
        min-width: 540px;
        height: 150px;
        background: linear-gradient(107.68deg, #ff7d9c 24.67%, #e65793 92.65%);
        border-radius: 17px;
        padding: 0 30px;

        .scale-title {
          width: 160px;
          font-size: 20px;
          line-height: 23px;
          color: #ffe1f1;
          background: #f96f9c;
          text-align: center;
          border-radius: 0 0 22px 22px;
          padding: 10px 15px;
          margin-bottom: 10px;
        }

        .scale-number {
          font-weight: 500;
          font-size: 40px;
          line-height: 60px;
          color: #ffffff;
          display: flex;
          align-items: baseline;
          justify-content: center;

          .trend-number {
            padding: 1px 4px;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 900;
            font-size: 12px;
            line-height: 17px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 3px;
            color: #000000;
            margin-left: 15px;

            &.up {
              color: #e21a1a;
            }
          }
        }

        &:last-child {
          background: #51afc6;
          margin-left: 30px;

          .scale-title {
            background-color: #3fb4cf;
            color: #cff2fb;
          }
        }
      }
    }
  }

  .token-table {
    width: 1110px;
  }
</style>
