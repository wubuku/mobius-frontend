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
      console.log(payload);

      const list = payload.body.assets;
      state.assetId = payload.id;

      state.collateral = (list.collateral || []).map((asset) => {
        const token_complete_name = toTokenString(asset.token_code);
        return {
          token_name: token_complete_name.split('::')[2],
          token_complete_name,
          ...asset,
        };
      });

      state.debt = (list.debt || []).map((asset) => {
        const token_complete_name = toTokenString(asset.token_code);
        return {
          token_name: token_complete_name.split('::')[2],
          token_complete_name,
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
