<template>
  <div class="asset-number">
    <div class="title">
      {{ title }}
    </div>
    <div class="value">
      $
      <span>{{ value }}</span>
      <span class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
      value: {
        type: [String, Number],
        default: '',
      },
      unit: {
        type: String,
        default: '',
      },
    },
    setup() {},
  });
</script>

<style lang="less" scoped>
  .asset-number {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 33px;
      line-height: 39px;
      color: #51afc6;
      margin-bottom: 25px;
    }

    .value {
      width: 250px;
      height: 80px;
      font-size: 36px;
      line-height: 42px;
      color: rgba(0, 0, 0, 0.85);
      background: #f7f9fa;
      box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.05);
      border-radius: 17.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;

      .unit {
        font-size: 18px;
        line-height: 21px;
        color: #9ca5b3;
      }
    }
  }
</style>
