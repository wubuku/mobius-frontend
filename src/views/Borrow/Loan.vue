<template>
  <div class="b-loan deposit-page">
    <div class="btn bell">清算提醒设置</div>
    <a-card class="left">
      <a-tabs type="card" class="tab-box" v-model:activeKey="mode">
        <a-tab-pane
          :key="ENUMS.TAB_NAME.BORROW.value"
          :tab="$t(`borrow.tab.${ENUMS.TAB_NAME.BORROW.value}`)"
        ></a-tab-pane>
        <a-tab-pane
          :key="ENUMS.TAB_NAME.REPAY.value"
          :tab="$t(`borrow.tab.${ENUMS.TAB_NAME.REPAY.value}`)"
        ></a-tab-pane>
      </a-tabs>
      <div class="card-container">
        <div class="token">
          <a-select
            class="token-select"
            placeholder="Select Token"
            @change="
              (address) =>
                (selectedToken = tokenList.find((token) => token.address == address) || [])
            "
            :value="selectedToken.address"
            option-label-prop="title"
            :key="selectedToken"
          >
            <a-select-option
              v-for="token in tokenList"
              :value="token.address"
              :title="token.name"
              :key="token.address"
            >
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

        <p v-if="isBorrowMode && currentResource.name">
          当前账户余额: {{ currentResource.amount }} {{ currentResource.name }}
        </p>

        <template v-if="!isBorrowMode">
          <p v-if="currentRepay.address">
            当前需还:
            <!-- 这里是要计算出来的 -->
            {{
              toHumanReadable({
                address: currentRepay.address,
                amount: currentRepay.token_amount,
              })
            }}
            {{ currentRepay.name }}
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
  import useQueryStore from 'uses/useQueryStore';

  import { BorrowContract, RepayContract } from 'service/BorrowService';
  import { addTxn } from 'utils/Txn';
  import { numberInput } from 'utils';
  import { ToHumanAmount } from 'config';

  export default defineComponent({
    props: {},
    setup() {
      const { tokenList, toHumanReadable } = useToken();
      const { accountHash, myResource, currentResource, debtList, assetId } = useUser();
      const {
        parseQuery,
        query,
        mode,
        amount,
        isBorrowMode,
        isRepayMode,
        selectedToken,
        defaultSelectValue,
        selectedTokenWatchHandler,
        tokenListWatchHandler,
      } = useQueryStore();

      const route = useRoute();
      const router = useRouter();
      const emitter = inject('emitter');
      const ENUMS = inject('ENUMS');

      const token = ref('');
      const risk = ref(0);
      const btnLoading = ref(false);

      const canSubmit = computed(() => !!selectedToken.value.name && amount.value > 0);

      const inputLargerThanAmount = computed(() => {
        return mode.value == ENUMS.TAB_NAME.BORROW.value
          ? amount.value > currentResource.value.amount
          : amount.value >
              toHumanReadable({
                address: currentRepay.value.address,
                amount: currentRepay.value.token_amount,
              });
      });

      const currentRepay = computed(() => {
        return debtList.value.find((item) => item.address == selectedToken.value.address) || {};
      });

      const submitBtnText = computed(() => {
        if (isBorrowMode.value) {
          if (amount.value > 0 && inputLargerThanAmount.value) {
            return '余额不足';
          }
          return '马上借';
        } else {
          // if (amount.value > 0 && inputLargerThanAmount.value) {
          //   return '余额不足';
          // }
          return '马上还';
        }
      });

      watch(selectedToken, () => {
        selectedTokenWatchHandler({ accountHash });
        // TODO:
        // 我的借款
      });

      watch(tokenList, () => {
        tokenListWatchHandler({ tokenList });
      });

      // hook
      onMounted(() => {
        parseQuery({
          type: 'BORROW',
          tokenList: tokenList.value,
        });
      });

      const formInit = () => {
        amount.value = '';
      };

      // method
      const submit = () => {
        btnLoading.value = true;
        if (isBorrowMode.value) {
          console.log({ token: selectedToken.value, nftId: assetId, amount: amount.value });
          BorrowContract({
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
        } else if (isRepayMode.value) {
          RepayContract({
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
          if (isBorrowMode.value) {
            amount.value = currentResource.value.amount;
          }

          if (isRepayMode.value) {
            // amount.value = maxWithdrawAmount.value;
          }
        }
      };

      return {
        mode,
        selectedToken,

        tokenList,

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
        isBorrowMode,
        ENUMS,

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
  @import '../../assets/style/deposit.less';

  .b-loan {
    padding-top: 90px;
    position: relative;

    .bell {
      position: absolute;
      right: 30px;
      top: 30px;
      width: 136px;
      z-index: 1;
    }
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
