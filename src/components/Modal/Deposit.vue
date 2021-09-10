<template>
  <a-modal
    v-bind="$attrs"
    :title="token.name"
    :closable="!btnLoading"
    centered
    :footer="null"
    width="360px"
  >
    <div class="input-box">
      <a-input
        class="amount"
        placeholder="0"
        v-model:value="amount"
        @input="() => (amount = numberInput(amount))"
        :bordered="false"
        ref="amountInput"
      ></a-input>
      <a-button class="btn input-box-btn" @click="setAllAmount">MAX</a-button>
    </div>
    <p class="error" v-if="errorText">{{ errorText }}</p>
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
        <span class="right highlight">1.24%</span>
      </div>
      <a-button class="btn submit-btn" :disabled="!canSubmit" @click="submit" :loading="btnLoading">
        {{ submitBtnText }}
      </a-button>
      <div class="info-item" v-if="isDepositMode">
        Wallet Balance
        <span class="right highlight">{{ token?.walletResource }} {{ token.name }}</span>
      </div>
      <div class="info-item" v-if="isWithdrawMode">
        isWithdrawMode Balance
        <span class="right highlight">123 {{ token.name }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import { computed, defineComponent, inject, reactive, ref, watch } from 'vue';
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
      const amount = ref('');
      const btnLoading = ref(false);
      const { token, visible } = reactive(props);
      const amountInput = ref(null);

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
      const canSubmit = computed(
        () => amount.value != '' && amount.value > 0 && !inputLargerThanAmount.value,
      );
      const submitBtnText = computed(() => (isDepositMode.value ? 'Deposit' : 'WithDraw'));
      const errorText = computed(() => {
        if (inputLargerThanAmount.value) return 'Not enough balance';
        return '';
      });

      watch(mode, () => {
        amount.value = '';
        amountInput.value.focus();
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
        isWithdrawMode,
        inputLargerThanAmount,
        maxWithdrawAmount,
        submitBtnText,
        errorText,
        btnLoading,
        amountInput,

        canSubmit,
        setAllAmount,
        submit,
        numberInput,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import './modal.less';
</style>
