/**
 * Save Txn to indexedDB
 */
import 'es6-promise/auto';
import { get, update, createStore } from 'idb-keyval';

const MobiusStore = createStore('mobius-db', 'mobius-store');
const TXN_KEY = 'txns';

export const addTxn = (txn) => {
  return update(
    TXN_KEY,
    (val = {}) => {
      val[txn] = false;
      return val;
    },
    MobiusStore,
  );
};

export const doneTxn = (txn) => {
  return update(
    TXN_KEY,
    (val = {}) => {
      val[txn] = true;
      return val;
    },
    MobiusStore,
  );
};

export const getAllUnfinishedTxns = () => {
  return get(TXN_KEY, MobiusStore).then((txns) => {
    return Object.keys(txns).filter((txn) => !txns[txn]);
  });
};

export const getAllTxn = () => {
  return get(TXN_KEY, MobiusStore);
};
