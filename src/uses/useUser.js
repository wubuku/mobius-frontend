import { computed } from 'vue';
import { useStore } from 'vuex';

export default () => {
  const store = useStore();

  return {
    accountHash: computed(() => {
      return store.state.accountHash;
    }),
  };
};
