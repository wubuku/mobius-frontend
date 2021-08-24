import { inject } from 'vue';
import { Modal } from 'ant-design-vue';
import { GetTransactionStatus } from 'service/InitService';
import { getAllUncheckedTxns, checkedTxn } from 'utils/Txn';

export default () => {
  const TXN_CHECK_INTERVAL = 3000;
  let rolling = true;
  const emitter = inject('emitter');

  const startTransactionCheck = async () => {
    try {
      rolling = true;
      const unchecked = await getAllUncheckedTxns();

      if (unchecked.length > 0) {
        const [currentTxn] = unchecked;
        const currentTxnStatus = await GetTransactionStatus(currentTxn);

        if (currentTxnStatus?.status === 'Executed') {
          Modal.destroyAll();
          checkedTxn(currentTxn);
          emitter.emit('getPersonalAsset');
        }
      }

      if (rolling) {
        setTimeout(startTransactionCheck, TXN_CHECK_INTERVAL);
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
