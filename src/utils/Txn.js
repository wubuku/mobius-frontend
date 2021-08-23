/**
 * Save Txn to indexedDB
 */
import 'es6-promise/auto';
import { get, update, createStore } from 'idb-keyval';
import useModal from 'uses/useModal';
const MobiusStore = createStore('mobius-db', 'mobius-store');
const TXN_KEY = (account) => `${account}_txns`;
const { openTxnModal, openTxnCheckedNotification } = useModal();

export const addTxn = (txn) => {
  if (!window.starcoin.selectedAddress) return Promise.reject();

  openTxnModal(txn);
  return update(
    TXN_KEY(window.starcoin.selectedAddress),
    (val = {}) => {
      val[txn] = false;
      return val;
    },
    MobiusStore,
  );
};

export const checkedTxn = (txn) => {
  if (!window.starcoin.selectedAddress) return Promise.reject();

  openTxnCheckedNotification(txn);
  return update(
    TXN_KEY(window.starcoin.selectedAddress),
    (val = {}) => {
      val[txn] = true;
      return val;
    },
    MobiusStore,
  );
};

export const getAllUncheckedTxns = () => {
  if (!window.starcoin.selectedAddress) return Promise.reject();

  return get(TXN_KEY(window.starcoin.selectedAddress), MobiusStore).then((txns) => {
    if (!txns) return [];
    return Object.keys(txns).filter((txn) => !txns[txn]);
  });
};

export const getAllTxn = () => {
  if (!window.starcoin.selectedAddress) return Promise.reject();

  return get(TXN_KEY(window.starcoin.selectedAddress), MobiusStore);
};
