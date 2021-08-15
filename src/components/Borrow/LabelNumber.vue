<template>
  <div class="label-number">
    <h3>{{ label }}</h3>
    <div class="num">
      <span class="value">{{ value }}</span>
      <span class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      label: {
        type: String,
        default: '',
      },
      value: {
        type: String,
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
  .label-number {
    margin-bottom: 45px;

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 16px;
      line-height: 19px;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
    }

    .num {
      display: flex;
      background: #f7f9fa;
      box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.05);
      border-radius: 17.5px;
      height: 35px;
      align-items: center;
      font-size: 18px;
      line-height: 21px;
      color: rgba(0, 0, 0, 0.85);

      .value {
        text-align: center;
        flex: 1;
      }

      .unit {
        margin-left: auto;
        padding-right: 25px;
        font-size: 18px;
        line-height: 21px;
        color: #9ca5b3;
      }
    }
  }
</style>
