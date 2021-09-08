import { toTokenString } from 'utils';

export default {
  namespaced: true,
  state: {
    assetId: '',
    collateral: {},
    debt: {},
    wallet: {},
    walletArray: [],
  },
  mutations: {
    UPDATE_ASSETS_DATA(state, payload) {
      const { collateral = [], debt = [] } = payload.body.assets;
      state.assetId = payload.id;

      collateral.forEach((asset) => {
        const address = toTokenString(asset.token_code);
        const name = address.split('::')[2];
        state.collateral[name] = {
          name: address.split('::')[2],
          address,
          ...asset,
        };
      });

      debt.forEach((asset) => {
        const address = toTokenString(asset.token_code);
        const name = address.split('::')[2];
        state.debt[name] = {
          name: address.split('::')[2],
          address,
          ...asset,
        };
      });
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
