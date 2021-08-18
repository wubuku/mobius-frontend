<template>
  <div class="b-deposit">
    <a-card class="left">
      <a-tabs type="card" class="tab-box" v-model:activeKey="mode">
        <a-tab-pane key="1" tab="拨款"></a-tab-pane>
        <a-tab-pane key="2" tab="取款"></a-tab-pane>
      </a-tabs>
      <div class="card-container">
        <div class="token">
          <a-select
            class="token-select"
            v-model:value="token"
            placeholder="select one country"
            option-label-prop="label"
            :options="options"
          >
            <template #option="{ value: val, label, icon }">
              <span role="img" :aria-label="val">{{ icon }}</span>
              &nbsp;&nbsp;{{ label }}
            </template>
          </a-select>
          <div class="apr">存款APR: 2.5%</div>
        </div>
        <div class="token no-underline">
          <span class="hint">价格: $2600.92</span>
          <span class="hint">市场行情</span>
        </div>

        <div class="input-box">
          <a-input class="amount" placeholder="请输入存款数量" v-model="amount"></a-input>
          <a-button class="btn input-box-btn">全部</a-button>
        </div>

        <p>当前账户余额: 0 ETH</p>

        <a-button class="btn submit-btn" :disabled="true">提交</a-button>
      </div>
    </a-card>

    <a-card class="right">
      <div class="item">
        <div class="label">已用比例</div>
        <a-progress :percent="30" :strokeWidth="2" />
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">存款数量(STC)</div>
        <a-input value="0" />
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">可借金额</div>
        <a-input value="0" />
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">市场剩余可取</div>
        <span>0</span>
      </div>
      <div class="item flex">
        <div class="label">最大抵押率</div>
        <span>0</span>
      </div>
      <div class="item flex">
        <div class="label">是否抵押</div>
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="diya" />
      </div>
    </a-card>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    props: {},
    setup() {
      const mode = ref('1');
      const token = ref('');
      const amount = ref(0);

      const options = ref([
        {
          value: 'china',
          label: 'China (中国)',
          icon: '🇨🇳',
        },
        {
          value: 'usa',
          label: 'USA (美国)',
          icon: '🇺🇸',
        },
        {
          value: 'japan',
          label: 'Japan (日本)',
          icon: '🇯🇵',
        },
        {
          value: 'korea',
          label: 'Korea (韩国)',
          icon: '🇨🇰',
        },
      ]);

      return {
        mode,
        token,
        options,
        amount,
      };
    },
  });
</script>

<style lang="less" scoped>
  .b-deposit {
    display: flex;
    gap: 30px;

    :depp(.ant-tabs-bar) {
      margin: 0;
    }

    :depp(.ant-tabs.ant-tabs-card .ant-tabs-card-bar) {
      .ant-tabs-nav-container {
        font-size: 26px;
        line-height: 30px;
        color: #4b4d51;
        height: 60px;
      }
      .ant-tabs-tab {
        height: 60px;
        line-height: 60px;
        padding: 0 40px;
        align-items: center;
        border-radius: 10px 10px 0 0;
        margin-right: 10px;
      }
    }

    .tab-box {
      width: 510px;
    }

    .card-container {
      height: 380px;
      border: 1px solid #f0f0f0;
      border-top: none;
      padding: 0 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .token {
        display: flex;
        border-bottom: 0.5px solid #9ca5b3;
        padding-bottom: 25px;
        width: 70%;
        display: flex;
        align-items: center;

        &.no-underline {
          border-bottom: none;
        }

        .token-select {
          width: 50%;
        }

        .apr {
          margin-left: auto;
        }

        .hint {
          font-size: 13px;
          line-height: 15px;
          color: #9ca5b3;
          flex: 1;
          padding-top: 20px;
          cursor: default;

          &:last-child {
            text-align: right;
          }
        }
      }

      .input-box,
      .amount {
        width: 100%;
        height: 65px;
        border-radius: 20px;
        font-size: 18px;
      }

      .input-box {
        position: relative;
        margin-bottom: 35px;

        .input-box-btn {
          position: absolute;
          right: 15px;
          top: 10px;
          height: 44px;
          background: rgba(#9ca5b3, 0.2);
          border-radius: 50px;
          font-size: 18px;
          line-height: 21px;
          color: #4b4d51;
          text-align: center;

          &:active {
            left: initial;
          }
        }
      }

      .submit-btn {
        width: 250px;
        height: 56px;
        border-radius: 50px;
        margin-top: 30px;
        font-size: 18px;
      }
    }
  }

  .left {
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    border-radius: 26px;
  }

  .right {
    width: 300px;
    min-height: 500px;
    background: #ffffff;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    border-radius: 26px;
    font-size: 13px;
    line-height: 15px;
    color: #9ca5b3;

    .item {
      margin: 10px 0;
      &.flex {
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .label {
          margin-right: auto;
        }

        span {
          color: #4b4d51;
        }
      }

      .ant-input {
        border: none;
        text-align: right;
        font-size: 18px;
        line-height: 60px;
        width: 70%;
      }
    }
  }

  :depp(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border: 0;
    outline: none;
  }
</style>
