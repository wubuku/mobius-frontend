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
      <a-table :columns="columns" :data-source="data" :pagination="false">
        <template #name="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #customTitle>
          <span>Name</span>
        </template>
        <template #tags="{ text: tags }">
          <span>
            <a-tag
              v-for="tag in tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template #action="{ record }">
          <span>
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">More actions</a>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      slots: {
        title: 'customTitle',
        customRender: 'name',
      },
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      slots: {
        customRender: 'tags',
      },
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      slots: {
        customRender: 'action',
      },
    },
  ];
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
      return {
        data,
        columns,
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
