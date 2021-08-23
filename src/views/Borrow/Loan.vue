<template>
  <div class="b-loan">
    <div class="btn bell">清算提醒设置</div>
    <a-card class="left">
      <a-tabs type="card" class="tab-box" v-model:activeKey="mode">
        <a-tab-pane key="borrow" tab="借款"></a-tab-pane>
        <a-tab-pane key="repay" tab="还款"></a-tab-pane>
      </a-tabs>
      <div class="card-container">
        <div class="token">
          <a-select
            class="token-select"
            placeholder="Select Token"
            @change="
              (tokenName) =>
                (selectedToken = tokenList.find((token) => token.name == tokenName) || [])
            "
            option-label-prop="value"
            :key="defaultSelectValue"
            :defaultValue="defaultSelectValue"
            :defaultActiveFirstOption="true"
            :filterOption="true"
          >
            <a-select-option v-for="token in tokenList" :value="token.name" :key="token.name">
              <span style="display: flex; height: 40px; align-items: center">
                {{ token.name }}
                <span style="margin-left: auto">ARY: 10%</span>
              </span>
            </a-select-option>
          </a-select>
          <div class="apr">存款APY: 2.5%</div>
        </div>
        <div class="token no-underline">
          <span class="hint">价格: $2600.92</span>
          <span class="hint">市场行情</span>
        </div>

        <div class="input-box">
          <a-input
            class="amount"
            placeholder="请输入借款数量"
            v-model:value="amount"
            @input="() => (amount = numberInput(amount))"
            :bordered="false"
            :disabled="!selectedToken.address"
          ></a-input>
          <a-button class="btn input-box-btn" @click="setAllAmount">全部</a-button>
        </div>

        <p v-if="mode == 'borrow' && currentResource.name">
          当前账户余额: {{ currentResource.amount }} {{ currentResource.name }}
        </p>

        <template v-if="mode == 'repay'">
          <p v-if="currentRepay.token_name">
            当前需还:
            <!-- 这里是要计算出来的 -->
            {{
              toHumanReadable({
                tokenName: currentRepay.token_name,
                amount: currentRepay.token_amount,
              })
            }}
            {{ currentRepay.token_name }}
          </p>
          <p v-else>当前无需还款</p>
        </template>

        <a-button
          class="btn submit-btn"
          :disabled="!canSubmit"
          @click="submit"
          :loading="btnLoading"
        >
          {{ submitBtnText }}
        </a-button>
      </div>
    </a-card>

    <a-card class="right">
      <div class="item slider">
        <div class="label">低风险</div>
        <div class="label">高风险</div>
        <a-slider id="test" :tip-formatter="null" v-model:value="risk" />
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">市场剩余可借</div>
        <span v-if="selectedToken.tokens">
          {{ ToHumanAmount(selectedToken.tokens.value, selectedToken.precision) }}
        </span>
      </div>
      <div class="item flex">
        <div class="label">当前健康指数</div>
        <span>0</span>
      </div>
      <div class="item flex">
        <div class="label">借贷APY</div>
        <span>0</span>
      </div>
      <div class="item flex">
        <div class="label">清算价格</div>
        <span>0</span>
      </div>
      <div class="item flex">
        <div class="label">清算惩罚</div>
        <span>0</span>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import useToken from 'uses/useToken';
  import useUser from 'uses/useUser';

  import { ToHumanAmount } from 'config';
  import { addTxn } from 'utils/Txn';
  import { numberInput } from 'utils';

  export default defineComponent({
    props: {},
    setup() {
      const { tokenList, firstTokenName, toHumanReadable } = useToken();
      const { accountHash, myResource, currentResource, debtList, assetId } = useUser();
      const route = useRoute();
      const router = useRouter();
      const emitter = inject('emitter');

      const LS_QUERY_KEY = 'borrowQuery';
      const selectedToken = ref({});
      const mode = ref('borrow');
      const token = ref('');
      const amount = ref('');
      const risk = ref(0);
      const defaultSelectValue = ref('');
      const btnLoading = ref(false);

      const canSubmit = computed(
        () => !!selectedToken.value.name && amount.value > 0 && !inputLargerThanAmount.value,
      );
      const inputLargerThanAmount = computed(() => {
        return mode.value == 'deposit'
          ? amount.value > currentResource.value.amount
          : amount.value >
              toHumanReadable({
                tokenName: currentRepay.value.token_name,
                amount: currentRepay.value.token_amount,
              });
      });
      const currentRepay = computed(() => {
        return debtList.value.find((item) => item.token_name == selectedToken.value.name) || {};
      });
      const submitBtnText = computed(() => {
        if (amount.value == '' && amount.value == 0) {
          return '马上借';
        } else if (amount.value > 0 && inputLargerThanAmount.value) {
          return '余额不足';
        }
        return '马上借';
      });

      watch(selectedToken, () => {
        if (!selectedToken.value.name || !accountHash.value) return;

        window.localStorage.setItem(
          LS_QUERY_KEY,
          JSON.stringify({
            tab: mode.value,
            tokenName: selectedToken.value.name,
          }),
        );

        if (mode.value == 'deposit') {
          myResource({
            account: accountHash.value,
            address: selectedToken.value.address,
          });
        }
      });

      watch(tokenList, () => {
        if (selectedToken.value.name) return;
        selectedToken.value = tokenList.value[0];
      });

      watch(mode, () => {
        const queryStr = window.localStorage.getItem(LS_QUERY_KEY);
        let tab = '';
        let tokenName = selectedToken.value.name;

        if (queryStr) {
          const query = JSON.parse(queryStr);
          tab = query.tab;
          tokenName = query.tokenName;
        }

        window.localStorage.setItem(
          LS_QUERY_KEY,
          JSON.stringify({
            tab: mode.value,
            tokenName,
          }),
        );

        amount.value = '';
      });

      // hook
      onMounted(() => {
        // 参数识别
        let { tab, tokenName } = route.query;
        if (tab && tokenName) {
          window.localStorage.setItem(LS_QUERY_KEY, JSON.stringify(route.query));
          router.replace({ name: 'BorrowDeposit', query: {} });
        } else if (window.localStorage.getItem(LS_QUERY_KEY)) {
          const query = JSON.parse(window.localStorage.getItem(LS_QUERY_KEY));
          tab = query.tab;
          tokenName = query.tokenName;
        }

        mode.value = tab || 'deposit';
        selectedToken.value =
          tokenList.value.find((item) => item.name === tokenName) || tokenList.value[0] || {};

        defaultSelectValue.value = tokenName || firstTokenName.value;
      });

      const formInit = () => {
        amount.value = '';
      };

      // method
      const submit = () => {
        btnLoading.value = true;
        // if (mode.value == 'borrow') {
        // } else if (mode.value == 'repay') {
        // }
      };

      const setAllAmount = () => {
        if (currentResource.value.name) {
          amount.value = currentResource.value.amount;
        }
      };

      return {
        mode,
        selectedToken,
        tokenList,
        firstTokenName,
        amount,
        canSubmit,
        currentResource,
        inputLargerThanAmount,
        submitBtnText,
        defaultSelectValue,
        debtList,
        currentRepay,
        btnLoading,
        risk,

        submit,
        setAllAmount,
        numberInput,
        toHumanReadable,
        ToHumanAmount,
      };
    },
  });
</script>

<style lang="less" scoped>
  .b-loan {
    display: flex;
    gap: 30px;
    position: relative;
    padding-top: 90px;

    .bell {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 136px;
      z-index: 1;
    }

    :deep(.ant-tabs-bar) {
      margin: 0;
    }

    :deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar) {
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
      height: 460px;
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

    .ant-divider-horizontal {
      margin: 40px 0;
    }

    .item {
      margin: 10px 0;

      &.slider {
        position: relative;
        padding-top: 20px;

        .label {
          position: absolute;
          top: 0;
          left: 0;
          color: #4b4d51;
          font-size: 14px;

          & + .label {
            left: initial;
            right: 0;
          }
        }
      }

      &.flex {
        margin: 30px 0;
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

  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border: 0;
    outline: none;
  }

  :deep(.ant-slider:hover .ant-slider-track) {
    background-color: transparent;
  }

  :deep(.ant-slider-track) {
    background-color: transparent;
  }

  :deep(.ant-slider-rail) {
    height: 6px;
    background: linear-gradient(277.83deg, #ff2257 7.12%, #f09a4f 47.41%, #4ffe80 93.06%);
    border-radius: 6px;
  }

  :deep(.ant-slider-handle) {
    margin-top: -4px;
    background: #ffffff;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    border: none !important;
  }
</style>
