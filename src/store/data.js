import { toTokenString } from 'utils';

export default {
  namespaced: true,
  state: {
    collateral: [],
    debt: [],
    assetId: '',
    chainId: '',
  },
  mutations: {
    UPDATE_ASSETS_DATA(state, payload) {
      const list = payload.body.assets;
      state.assetId = payload.id;

      state.collateral = (list.collateral || []).map((asset) => {
        const address = toTokenString(asset.token_code);
        return {
          name: address.split('::')[2],
          address,
          ...asset,
        };
      });

      state.debt = (list.debt || []).map((asset) => {
        const address = toTokenString(asset.token_code);
        return {
          name: address.split('::')[2],
          address,
          ...asset,
        };
      });
    },
    UPDATE_CHAIN_ID(state, payload) {
      state.chainId = payload || '';
    },
  },
  actions: {
    $updateAssetsData({ commit }, payload) {
      commit('UPDATE_ASSETS_DATA', payload);
    },
    $updateChainId({ commit }, payload) {
      commit('UPDATE_CHAIN_ID', payload);
    },
  },
};
