import { toTokenString } from 'utils';

export default {
  namespaced: true,
  state: {
    collateral: [],
    debt: [],
    assetId: '',
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
  },
  actions: {
    $updateAssetsData({ commit }, payload) {
      commit('UPDATE_ASSETS_DATA', payload);
    },
  },
};
