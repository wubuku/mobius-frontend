<template>
  <a-modal v-bind="$attrs" :title="token.name" centered :footer="null">
    <div class="input-box">
      <a-input
        class="amount"
        placeholder="请输入存款数量"
        v-model:value="amount"
        @input="() => (amount = numberInput(amount))"
        :bordered="false"
      ></a-input>
      <a-button class="btn input-box-btn" @click="setAllAmount">全部</a-button>
    </div>
    <div class="modal-tab">
      <div
        class="modal-tab-item"
        :class="{ active: isDepositMode }"
        @click="() => (mode = ENUMS.TAB_NAME.DEPOSIT.value)"
      >
        {{ $t(`borrow.tab.${ENUMS.TAB_NAME.DEPOSIT.value}`) }}
      </div>
      <div
        class="modal-tab-item"
        :class="{ active: !isDepositMode }"
        @click="() => (mode = ENUMS.TAB_NAME.WITHDRAW.value)"
      >
        {{ $t(`borrow.tab.${ENUMS.TAB_NAME.WITHDRAW.value}`) }}
      </div>
    </div>

    <div class="modal-info">
      <div class="info-item">
        借款APY
        <span class="right">1.24%</span>
      </div>
      <div class="info-item">
        Distribution APY
        <span class="right">1.24%</span>
      </div>
      <div class="info-item">
        Borrow Limit
        <span class="right">1.24%</span>
      </div>
      <div class="info-item">
        Borrow Limit Used
        <span class="right">1.24%</span>
      </div>
      <a-button class="btn submit-btn" :disabled="!canSubmit" @click="submit" :loading="btnLoading">
        {{ submitBtnText }}
      </a-button>
    </div>
  </a-modal>
</template>

<script>
  import { computed, defineComponent, inject, reactive, ref } from 'vue';
  import { numberInput } from 'utils';
  import { addTxn } from 'utils/Txn';
  import { DepositContract, WithdrawContract, InitAssetContract } from 'service/BorrowService';
  import useToken from '../../uses/useToken';
  import useUser from '../../uses/useUser';

  export default defineComponent({
    props: {
      token: {
        type: Object,
        default: () => {},
      },
    },
    setup(props, { emit, attrs }) {
      const { toHumanReadable } = useToken();
      const { assetId, getPersonalAssets } = useUser();
      const ENUMS = inject('ENUMS');
      const mode = ref(ENUMS.TAB_NAME.DEPOSIT.value);
      const amount = ref(0);
      const btnLoading = ref(false);
      const { token, visible } = reactive(props);

      const maxWithdrawAmount = computed(() =>
        toHumanReadable({
          address: token?.address,
          amount: token?.tokens.value,
        }),
      );
      const isDepositMode = computed(() => mode.value === ENUMS.TAB_NAME.DEPOSIT.value);
      const isWithdrawMode = computed(() => mode.value === ENUMS.TAB_NAME.WITHDRAW.value);
      const inputLargerThanAmount = computed(() => {
        return isDepositMode.value
          ? amount.value > ~~token?.walletResource
          : amount.value > ~~maxWithdrawAmount.value;
      });
      const canSubmit = computed(() => amount.value > 0 && !inputLargerThanAmount.value);
      const submitBtnText = computed(() => {
        if (amount.value == '' && amount.value == 0) {
          return '提交';
        } else if (amount.value > 0 && inputLargerThanAmount.value) {
          return '余额不足';
        }
        return '提交';
      });

      const setAllAmount = () => {
        if (isDepositMode.value) {
          amount.value = token?.walletResource;
        }

        if (isWithdrawMode.value) {
          amount.value = maxWithdrawAmount.value;
        }
      };

      const formInit = () => {
        amount.value = '';
      };

      const submit = () => {
        btnLoading.value = true;

        // Deposit or Withdraw
        if (isDepositMode.value) {
          if (!assetId.value) {
            InitAssetContract({
              token: token,
              amount: amount.value,
            })
              .then((res) => {
                addTxn({
                  txn: res,
                  address: token?.address,
                  name: token?.name,
                  oper: mode.value,
                  amount: amount.value,
                });
                formInit();
                getPersonalAssets();
              })
              .finally(() => {
                btnLoading.value = false;
                emit('update:visible', !attrs.visible);
              });
          } else {
            DepositContract({
              token: token,
              nftId: assetId.value,
              amount: amount.value,
            })
              .then((res) => {
                addTxn({
                  txn: res,
                  address: token?.address,
                  name: token?.name,
                  oper: mode.value,
                  amount: amount.value,
                });
                formInit();
                getPersonalAssets();
              })
              .finally(() => {
                btnLoading.value = false;
                emit('update:visible', !attrs.visible);
              });
          }
        } else {
          WithdrawContract({
            token: token,
            nftId: assetId.value,
            amount: amount.value === maxWithdrawAmount.value ? 0 : amount.value,
          })
            .then((res) => {
              addTxn({
                txn: res,
                address: token?.address,
                name: token?.name,
                oper: mode.value,
                amount: amount.value,
              });
              formInit();
              getPersonalAssets();
            })
            .finally(() => {
              btnLoading.value = false;
              emit('update:visible', !attrs.visible);
            });
        }
      };

      return {
        mode,
        ENUMS,
        amount,
        isDepositMode,
        inputLargerThanAmount,
        maxWithdrawAmount,
        submitBtnText,
        btnLoading,

        canSubmit,
        setAllAmount,
        submit,
        numberInput,
      };
    },
  });
</script>

<style lang="less" scoped>
  .deposit-modal {
    color: #111;
  }
  .modal-info {
    width: 100%;
    min-height: 200px;
    margin-top: 20px;
    padding: 20px;
    background-color: #eee;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .info-item {
      width: 100%;
      display: flex;
      height: 40px;
      font-size: 16px;
      .right {
        margin-left: auto;
      }
    }
  }
  .modal-tab {
    width: 80%;
    display: flex;
    gap: 50px;
    margin: 0 auto;

    .modal-tab-item {
      width: 300px;
      height: 44px;
      font-size: 16px;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid transparent;
      cursor: pointer;

      &.active,
      &:hover {
        background-color: #eee;
        border-bottom: 2px solid #ddd;
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
</style>
