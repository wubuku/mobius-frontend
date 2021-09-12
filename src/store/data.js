import { toTokenString } from 'utils';

export default {
  namespaced: true,
  state: {
    assetId: '',
    wallet: {},
    walletArray: [],
  },
  mutations: {
    UPDATE_ASSETS_DATA(state, payload) {
      state.assetId = payload;
    },
    UPDATE_WALLET_DATA(state, payload = []) {
      if (payload.length === 0) {
        state.wallet = {};
        state.walletArray = [];
      } else {
        state.walletArray = [...payload];
        payload.forEach((token) => {
          state.wallet[token.name] = token;
        });
      }
    },
  },
  actions: {
    $updateAssetsData({ commit }, payload) {
      commit('UPDATE_ASSETS_DATA', payload);
    },
    $updateWalletResource({ commit }, payload) {
      commit('UPDATE_WALLET_DATA', payload);
    },
  },
};
