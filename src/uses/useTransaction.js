import { Modal } from 'ant-design-vue';
import { GetTransactionStatus } from 'service/InitService';
import { getAllUncheckedTxns, checkedTxn, checkedTxnFaild } from 'utils/Txn';

export default () => {
  const TXN_CHECK_INTERVAL = 3000;
  let rolling = true;

  // const startTransactionCheck = async () => {
  //   try {
  //     rolling = true;
  //     const unchecked = await getAllUncheckedTxns();

  //     if (unchecked.length > 0) {
  //       const [currentTxn] = unchecked;
  //       const currentTxnStatus = await GetTransactionStatus(currentTxn);

  //       if (currentTxnStatus?.status === 'Executed') {
  //         Modal.destroyAll();
  //         checkedTxn(currentTxn);
  //       } else if (typeof currentTxnStatus?.status?.MoveAbort == 'object') {
  //         Modal.destroyAll();
  //         checkedTxnFaild(currentTxn);
  //       }
  //     }

  //     if (rolling) {
  //       setTimeout(startTransactionCheck, TXN_CHECK_INTERVAL);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const startTransactionCheck = async (txn) => {
    try {
      const currentTxnStatus = await GetTransactionStatus(txn);

      if (currentTxnStatus?.status === 'Executed') {
        return Promise.resolve();
      } else if (typeof currentTxnStatus?.status === 'object') {
        return Promise.reject({
          message: `${txn} Transaction Faild!`,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const stopTransactionCheck = () => {
    rolling = false;
  };

  const restartTransactionCheck = () => {
    rolling = true;
  };

  return {
    startTransactionCheck,
    stopTransactionCheck,
    restartTransactionCheck,
  };
};
