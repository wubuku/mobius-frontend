<template>
  <div class="m-account">
    <div class="account-balance">
      323232
      <div class="balance">M 0.00</div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {},
    setup() {},
  });
</script>

<style lang="less" scoped>
  .m-account {
    display: flex;
    align-items: center;

    .account-balance {
      border-radius: 10px;
      background-color: var(--themeColor);
      color: var(--color);
      box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
      padding: 5px 10px;
      margin-left: 10px;
      display: flex;
      align-items: center;

      &:hover {
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
      }

      .balance {
        background-color: #eee;
        border-radius: 10px;
        margin-left: 10px;
        padding: 5px 10px;
        color: var(--color);
      }
    }
  }
</style>
