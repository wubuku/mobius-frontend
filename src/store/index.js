import { createStore } from 'vuex';

import Data from './data';
import Constans from 'utils/Constants';

export default createStore({
  state: {
    appConfig: {
      darkTheme: false,
    },
    accountHash: '',
    tokenList: [],
  },
  getters: {
    appConfig: (state) => state.appConfig,
    darkTheme: (state) => state.appConfig?.darkTheme,
    $accountHash: (state) => state.accountHash,
  },
  mutations: {
    setAppConfig(state, payload) {
      if (typeof payload == 'object') {
        localStorage.setItem(Constans.APP_CONFIG_KEY, JSON.stringify(payload));
        state.appConfig = payload;
      }
    },
    UPDATE_ACCOUNT_HASH(state, payload) {
      state.accountHash = payload;
    },
    SET_TOKEN_LIST(state, payload) {
      state.tokenList = payload;
    },
  },
  actions: {
    /**
     * 更新account
     */
    $updateAccountHash({ commit }, payload) {
      commit('UPDATE_ACCOUNT_HASH', payload);
    },
    /**
     * 保存配置
     */
    $setAppConfig({ commit }, payload) {
      commit('setAppConfig', payload);
    },
    /**
     * Set Dark Theme
     */
    $setDarkTheme({ commit }, isDark) {
      try {
        const payload = JSON.parse(localStorage.getItem(Constans.APP_CONFIG_KEY)) || {};
        payload.darkTheme = !!isDark;
        commit('setAppConfig', payload);
      } catch (e) {
        console.warn(e);
      }
    },

    $getTokenList({ commit }, payload) {
      commit('SET_TOKEN_LIST', payload);
    },
  },
  modules: {
    data: Data,
  },
});
