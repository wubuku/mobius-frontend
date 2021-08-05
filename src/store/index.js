import { createStore } from 'vuex';
import Constans from 'utils/Constants';

export default createStore({
  state: {
    appConfig: {
      darkTheme: false,
    },
  },
  getters: {
    appConfig: (state) => state.appConfig,
    darkTheme: (state) => state.appConfig?.darkTheme,
  },
  mutations: {
    setAppConfig(state, payload) {
      if (typeof payload == 'object') {
        localStorage.setItem(Constans.APP_CONFIG_KEY, JSON.stringify(payload));
        state.appConfig = payload;
      }
    },
  },
  actions: {
    setAppConfig({ commit }, payload) {
      commit('setAppConfig', payload);
    },
    /**
     * Set Dark Theme
     */
    setDarkTheme({ commit }, isDark) {
      try {
        const payload = JSON.parse(localStorage.getItem(Constans.APP_CONFIG_KEY)) || {};
        payload.darkTheme = !!isDark;
        commit('setAppConfig', payload);
      } catch (e) {
        console.warn(e);
      }
    },
  },
  modules: {},
});
