import { createStore } from 'vuex';

import Data from './data';
import Constans from 'utils/Constants';

import { hexToStr, toTokenString } from 'utils';
import { GetTokenList, TokenStandardPosition } from 'service/InitService';

let tokenUpdating = false;
const TOKEN_UPDATE_DURATION = 3e3;
const UpdateTokenList = (commit) => {
  if (tokenUpdating) {
    return;
  }
  // Get Token List First
  GetTokenList()
    .then((res) => {
      const tokens = res?.json?.payload?.support_token_codes || [];

      if (tokens.length > 0) {
        // Get Detail of each Token
        Promise.all(
          tokens.map((token) => {
            return TokenStandardPosition(toTokenString(token));
          }),
        )
          .then((tokenDetails) => {
            // Merge Detail and Token Basic Name
            commit(
              'SET_TOKEN_LIST',
              tokenDetails.map((detail, index) => {
                return {
                  address: toTokenString(tokens[index]),
                  name: hexToStr(tokens[index].name),
                  ...detail,
                };
              }),
            );
          })
          .finally(() => {
            // FIXME: need to stop
            // setTimeout(() => {
            //   tokenUpdating = false;
            //   UpdateTokenList(commit);
            // }, TOKEN_UPDATE_DURATION);
          });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

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
    $getTokenList({ commit }) {
      UpdateTokenList(commit);
    },
  },
  modules: {
    data: Data,
  },
});
