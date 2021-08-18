import { computed } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();

  return {
    tokenList: computed(() => {
      return store.state.tokenList;
    }),
    getTokenList: () => store.dispatch('$getTokenList'),
  };
};
