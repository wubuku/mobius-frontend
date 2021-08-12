<template>
  <div class="main-layout">
    <m-header></m-header>
    <div class="view">
      <router-view></router-view>
    </div>
    <m-footer></m-footer>
  </div>
</template>

<script>
  import MHeader from 'comp/Header';
  import MFooter from 'comp/Footer';
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {},
    components: {
      MHeader,
      MFooter,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="less" scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .view {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
