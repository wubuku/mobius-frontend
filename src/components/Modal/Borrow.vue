<template>
  <a-modal v-bind="$attrs" :title="token.name" :closable="!btnLoading" centered :footer="null">
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
        :class="{ active: isBorrowMode }"
        @click="() => (mode = ENUMS.TAB_NAME.BORROW.value)"
      >
        {{ $t(`borrow.tab.${ENUMS.TAB_NAME.BORROW.value}`) }}
      </div>
      <div
        class="modal-tab-item"
        :class="{ active: !isBorrowMode }"
        @click="() => (mode = ENUMS.TAB_NAME.REPAY.value)"
      >
        {{ $t(`borrow.tab.${ENUMS.TAB_NAME.REPAY.value}`) }}
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
      <div class="info-item" v-if="isRepayMode">
        Wallet Balance
        <span class="right highlight">{{ token?.walletResource }} {{ token.name }}</span>
      </div>
      <div class="info-item" v-if="isBorrowMode">
        isRepayMode Balance
        <span class="right highlight">123 {{ token.name }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import { computed, defineComponent, inject, reactive, ref, watch } from 'vue';
  import { numberInput } from 'utils';
  import { BorrowContract, RepayContract } from 'service/BorrowService';
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
      const mode = ref(ENUMS.TAB_NAME.BORROW.value);
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
      const isBorrowMode = computed(() => mode.value === ENUMS.TAB_NAME.BORROW.value);
      const isRepayMode = computed(() => mode.value === ENUMS.TAB_NAME.REPAY.value);
      const inputLargerThanAmount = computed(() => {
        return isBorrowMode.value
          ? amount.value > ~~token?.walletResource
          : amount.value > ~~maxWithdrawAmount.value;
      });
      const canSubmit = computed(
        () => amount.value != '' && amount.value > 0 && !inputLargerThanAmount.value,
      );
      const submitBtnText = computed(() => (isBorrowMode.value ? 'Borrow' : 'Repay'));
      const errorText = computed(() => {
        if (inputLargerThanAmount.value) return 'Not enough balance';
        return '';
      });

      watch(mode, () => {
        amount.value = '';
        amountInput.value.focus();
      });

      const setAllAmount = () => {
        if (isBorrowMode.value) {
          amount.value = token?.walletResource;
        }

        if (isRepayMode.value) {
          amount.value = maxWithdrawAmount.value;
        }
      };

      const formInit = () => {
        amount.value = '';
      };

      const submit = () => {
        btnLoading.value = true;

        // Borrow or Withdraw
        if (isBorrowMode.value) {
          BorrowContract({
            token: token,
            nftId: assetId.value,
            amount: amount.value,
          })
            .then((res) => {
              formInit();
              emit('update:visible', !attrs.visible);
            })
            .finally(() => {
              btnLoading.value = false;
            });
        } else if (isRepayMode.value) {
          RepayContract({
            token: token,
            nftId: assetId.value,
            amount: amount.value,
          })
            .then((res) => {
              formInit();
              emit('update:visible', !attrs.visible);
            })
            .finally(() => {
              btnLoading.value = false;
            });
        }
      };

      return {
        mode,
        ENUMS,
        amount,
        isRepayMode,
        isBorrowMode,
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
