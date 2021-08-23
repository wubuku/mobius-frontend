<template>
  <div class="b-deposit">
    <a-card class="left">
      <a-tabs type="card" class="tab-box" v-model:activeKey="mode">
        <a-tab-pane key="deposit" tab="存款"></a-tab-pane>
        <a-tab-pane key="withdraw" tab="取款"></a-tab-pane>
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
          <div class="apr" v-if="selectedToken.token_risk_params">
            存款APY:
            {{ selectedToken.token_risk_params.deposit_apy.mantissa / selectedToken.precision }}
          </div>
        </div>
        <div class="token no-underline">
          <span class="hint">价格: $2600.92</span>
          <span class="hint">市场行情</span>
        </div>

        <div class="input-box">
          <a-input
            class="amount"
            placeholder="请输入存款数量"
            v-model:value="amount"
            @input="() => (amount = numberInput(amount))"
            :bordered="false"
            :disabled="!selectedToken.address"
          ></a-input>
          <a-button class="btn input-box-btn" @click="setAllAmount">全部</a-button>
        </div>

        <p v-if="mode == 'deposit' && currentResource.name">
          当前账户余额: {{ currentResource.amount }} {{ currentResource.name }}
        </p>

        <template v-if="mode == 'withdraw'">
          <p v-if="currentWithdraw.address">
            当前可取:
            <!-- 这里是要计算出来的 -->
            {{
              toHumanReadable({
                tokenName: currentWithdraw.address,
                amount: currentWithdraw.token_amount,
              })
            }}
            {{ currentWithdraw.token_name }}
          </p>
          <p v-else>当前无可取</p>
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
      <div class="item">
        <div class="label">已用比例</div>
        <a-progress :percent="30" :strokeWidth="2" />
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">存款数量({{ selectedToken.name }})</div>
        <span class="amount-span">{{ amount }}</span>
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">可借金额</div>
        <span class="amount-span">0</span>
      </div>
      <a-divider :dashed="true" />
      <div class="item flex">
        <div class="label">市场剩余可借</div>
        <span v-if="selectedToken.tokens">
          {{ ToHumanAmount(selectedToken.tokens.value, selectedToken.precision) }}
        </span>
      </div>
      <div class="item flex">
        <div class="label">最大抵押率</div>
        <span>0</span>
      </div>
      <!-- <div class="item flex">
        <div class="label">是否抵押</div>
        <a-switch checked-children="是" un-checked-children="否" />
      </div> -->
    </a-card>
  </div>
</template>

<script>
  import {
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onMounted,
    ref,
    watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { DepositContract, WithdrawContract, InitAssetContract } from 'service/BorrowService';
  import { GetTransactionStatus } from 'service/InitService';
  import { addTxn } from 'utils/Txn';
  import { numberInput } from 'utils';
  import { ToHumanAmount } from 'config';

  import useToken from 'uses/useToken';
  import useUser from 'uses/useUser';

  export default defineComponent({
    props: {},
    setup() {
      const $message = inject('$message');
      const { tokenList, firstTokenName, toHumanReadable } = useToken();
      const { accountHash, myResource, currentResource, collateralList, assetId } = useUser();
      const route = useRoute();
      const router = useRouter();
      const emitter = inject('emitter');

      // data
      const LS_QUERY_KEY = 'depositQuery';
      const selectedToken = ref({});
      const mode = ref('deposit');
      const amount = ref('');
      const defaultSelectValue = ref('');
      const btnLoading = ref(false);

      // computed
      const canSubmit = computed(
        () => !!selectedToken.value.name && amount.value > 0 && !inputLargerThanAmount.value,
      );
      const inputLargerThanAmount = computed(() => {
        return mode.value == 'deposit'
          ? amount.value > currentResource.value.amount
          : amount.value >
              toHumanReadable({
                tokenName: currentWithdraw.value.token_name,
                amount: currentWithdraw.value.token_amount,
              });
      });
      const submitBtnText = computed(() => {
        if (amount.value == '' && amount.value == 0) {
          return '提交';
        } else if (amount.value > 0 && inputLargerThanAmount.value) {
          return '余额不足';
        }
        return '提交';
      });
      const currentWithdraw = computed(() => {
        return (
          collateralList.value.find((item) => item.token_name == selectedToken.value.name) || {}
        );
      });

      // watch
      watch(selectedToken, () => {
        if (!selectedToken.value.name || !accountHash.value) return;

        if (mode.value == 'deposit') {
          myResource({
            account: accountHash.value,
            address: selectedToken.value.address,
          });
        }

        window.localStorage.setItem(
          LS_QUERY_KEY,
          JSON.stringify({
            tab: mode.value,
            tokenName: selectedToken.value.address,
          }),
        );
      });

      watch(tokenList, () => {
        if (selectedToken.value.address) return;
        selectedToken.value = tokenList.value[0];
      });

      watch(mode, () => {
        const queryStr = window.localStorage.getItem(LS_QUERY_KEY);
        let tab = '';
        let tokenName = selectedToken.value.address;

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
          tokenList.value.find((item) => item.address === tokenName) || tokenList.value[0] || {};
        console.log(tokenName, tokenList);

        defaultSelectValue.value = tokenName || firstTokenName.value;
      });

      const formInit = () => {
        amount.value = '';
      };

      // method
      const submit = () => {
        btnLoading.value = true;
        if (mode.value == 'deposit') {
          // 如果assetId没有的话, 就要用 init_assets
          if (!assetId.value) {
            InitAssetContract({
              token: selectedToken.value,
              amount: amount.value,
            })
              .then((res) => {
                addTxn(res);
                formInit();
                emitter.emit('getPersonalAsset');
              })
              .finally(() => {
                btnLoading.value = false;
              });
          } else {
            DepositContract({
              token: selectedToken.value,
              nftId: assetId.value,
              amount: amount.value,
            })
              .then((res) => {
                formInit();
                addTxn(res);
                emitter.emit('getPersonalAsset');
              })
              .finally(() => {
                btnLoading.value = false;
              });
          }
        } else if (mode.value == 'withdraw') {
          //FIXME: 如果一样的话,要给0
          WithdrawContract({
            token: selectedToken.value,
            nftId: assetId.value,
            amount: amount.value,
          })
            .then((res) => {
              formInit();
              addTxn(res);
              emitter.emit('getPersonalAsset');
            })
            .finally(() => {
              btnLoading.value = false;
            });
        }
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
        collateralList,
        currentWithdraw,
        btnLoading,

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
  .b-deposit {
    display: flex;
    gap: 30px;
    margin-top: 50px;

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
      margin-top: 50px;

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

      .amount {
        padding-right: 120px;
        padding-left: 20px;
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
    min-width: 560px;
    width: 560px;
  }

  .right {
    min-width: 300px;
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

      .amount-span {
        border: none;
        text-align: right;
        font-size: 18px;
        height: 60px;
        width: 70%;
        word-break: break-all;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }

  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border: 0;
    outline: none;
  }
</style>
