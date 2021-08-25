<template>
  <div class="b-history">
    <a-table :dataSource="dataSource" :columns="HistoryColumn">
      <template #detail="{ record }">
        <a :href="record.browserUrl" target="_blank">
          StcScan 浏览器
          <LinkOutlined />
        </a>
      </template>
    </a-table>
  </div>
</template>

<script>
  import { defineComponent, inject, onMounted, ref, watch } from 'vue';
  import { LinkOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';

  import { getAllTxn } from 'utils/Txn';
  import { BROWSER_URL_OF_TRANSACTION, ENUMS } from 'config';

  import useTable from 'uses/useTable';
  import useUser from 'uses/useUser';

  export default defineComponent({
    props: {},
    components: {
      LinkOutlined,
    },
    setup() {
      const { HistoryColumn } = useTable();
      const ENUMS = inject('ENUMS');

      const dataSource = ref([]);

      const formatTxnResultToTimeSortedList = (txnResult) => {
        return Object.keys(txnResult)
          .map((txn, index) => {
            return {
              ...txnResult[txn],
              txnHash: txn,
              browserUrl: BROWSER_URL_OF_TRANSACTION(txn),
              createdAtStr: dayjs(txnResult[txn].createdAt).format('YYYY-MM-DD HH:mm:ss'),
              key: index,
            };
          })
          .sort((next, prev) => {
            return next.createdAt > prev.createdAt;
          });
      };

      onMounted(() => {
        getTxnHistoryList();
      });

      const getTxnHistoryList = () => {
        getAllTxn().then((res) => {
          dataSource.value = res ? formatTxnResultToTimeSortedList(res) : [];
        });
      };

      return {
        dataSource,

        HistoryColumn,
      };
    },
  });
</script>

<style lang="less" scoped>
  .b-history {
  }
</style>
