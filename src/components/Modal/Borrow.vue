<template>
  <a-modal
    v-bind="$attrs"
    :title="token.name"
    :closable="!btnLoading"
    :maskClosable="!btnLoading"
    centered
    :footer="null"
    width="500px"
  >
    <!-- <span style="color: white">
      {{ token }}
    </span> -->
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
      <!--  -->
      <div class="info-item">
        借款APY
        <span class="right">{{ toPercent(toReadMantissa(token.borrow_rate.mantissa)) }}</span>
      </div>
      <!-- <div class="info-item">
        Distribution APY
        <span class="right">1.24%</span>
      </div> -->

      <!--  -->
      <div class="info-item">
        Borrow Balance
        <span class="right">
          $
          {{
            getOracleValue({
              amount: toHumanReadable({
                amount: token.debt?.debtAsset?.token_amount,
                address: token.address,
              }),
              oracle: token.oracle,
            })
          }}
          <span class="arrow-box" v-if="amount > 0">
            <ArrowRightOutlined class="arrow" />
            ${{ borrowBalance }}
          </span>
        </span>
      </div>
      <!--  -->
      <div class="info-item">
        Borrow Limit Used
        <span class="right highlight">0%</span>
      </div>
      <!--  -->
      <a-button class="btn submit-btn" :disabled="!canSubmit" @click="submit" :loading="btnLoading">
        {{ submitBtnText }}
      </a-button>

      <!-- Currently borrow -->
      <div class="info-item">
        Currently Borrowing
        <span class="right" :class="{ highlight: isBorrowMode }">
          {{ CurrentlyBorrwing }} {{ token.name }}
        </span>
      </div>

      <!-- Wallet Balance -->
      <div class="info-item">
        Wallet Balance
        <span class="right" :class="{ highlight: isRepayMode }">
          {{ token?.walletResource }} {{ token.name }}
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import BigNumber from 'bignumber.js';
  import { computed, defineComponent, inject, reactive, ref, watch } from 'vue';
  import { numberInput } from 'utils';
  import { ArrowRightOutlined } from '@ant-design/icons-vue';
  import { BorrowContract, RepayContract } from 'service/BorrowService';
  import useToken from '../../uses/useToken';
  import useUser from '../../uses/useUser';
  import useTransaction from '../../uses/useTransaction';

  export default defineComponent({
    props: {
      token: {
        type: Object,
        default: () => {},
      },
    },
    components: {
      ArrowRightOutlined,
    },
    setup(props, { emit, attrs }) {
      const { toHumanReadable, toReadMantissa, toPercent, getOracleValue } = useToken();
      const { startTransactionCheck } = useTransaction();
      const { assetId } = useUser();

      const ENUMS = inject('ENUMS');
      const emitter = inject('emitter');
      const messageModal = inject('$message');

      const { token } = reactive(props);

      const mode = ref(ENUMS.TAB_NAME.BORROW.value);
      const amount = ref('');
      const borrowBalance = ref('');
      const btnLoading = ref(false);
      const amountInput = ref(null);

      // CurrentlyBorrwing
      const CurrentlyBorrwing = computed(() =>
        toHumanReadable({
          address: token?.address,
          amount: token.debt?.debtAsset?.token_amount || 0,
        }),
      );

      const isBorrowMode = computed(() => mode.value === ENUMS.TAB_NAME.BORROW.value);
      const isRepayMode = computed(() => mode.value === ENUMS.TAB_NAME.REPAY.value);
      const inputLargerThanAmount = computed(() => {
        return isBorrowMode.value
          ? new BigNumber(amount.value).isGreaterThan(token?.walletResource)
          : new BigNumber(amount.value).isGreaterThan(CurrentlyBorrwing.value);
      });
      const canSubmit = computed(
        () => amount.value != '' && amount.value > 0 && !inputLargerThanAmount.value,
      );
      const submitBtnText = computed(() => (isBorrowMode.value ? 'Borrow' : 'Repay'));
      const errorText = computed(() => {
        if (inputLargerThanAmount.value) return 'Not enough balance';
        return '';
      });
      const totalBalance = computed(() => {
        if (amount.value == 0) return 0;
        const currentBalance = new BigNumber(
          toHumanReadable({
            amount: token.debt?.debtAsset?.token_amount,
            address: token.address,
          }),
        );

        return isBorrowMode.value
          ? currentBalance.plus(amount.value)
          : currentBalance.minus(amount.value);
      });

      watch(mode, () => {
        amount.value = '';
        amountInput.value.focus();
      });

      watch(amount, () => {
        borrowBalance.value = getOracleValue({
          amount: totalBalance.value,
          oracle: token.oracle,
        });
      });

      const setAllAmount = () => {
        if (isBorrowMode.value) {
          amount.value = token?.walletResource;
        }

        if (isRepayMode.value) {
          amount.value = CurrentlyBorrwing.value;
        }
      };

      const formInit = () => {
        amount.value = '';
      };

      const submit = async () => {
        btnLoading.value = true;

        // Borrow or Withdraw
        if (isBorrowMode.value) {
          try {
            const txn = await BorrowContract({
              token: token,
              nftId: assetId.value,
              amount: amount.value,
            });
            await startTransactionCheck(txn);
            formInit();
            emitter.emit('getPersonalAssets');
            messageModal.success('Transaction Success!');
          } catch (err) {
            if (err.message) {
              messageModal.error(err.message);
            }
          }
        } else if (isRepayMode.value) {
          try {
            const txn = await RepayContract({
              token: token,
              nftId: assetId.value,
              amount: amount.value,
            });
            await startTransactionCheck(txn);
            emitter.emit('getPersonalAssets');
            messageModal.success('Transaction Success!');
          } catch (err) {
            if (err.message) {
              messageModal.error(err.message);
            }
          }
        }

        btnLoading.value = false;
      };

      return {
        mode,
        ENUMS,
        amount,
        isRepayMode,
        isBorrowMode,
        inputLargerThanAmount,
        CurrentlyBorrwing,
        submitBtnText,
        errorText,
        btnLoading,
        amountInput,
        totalBalance,
        borrowBalance,

        canSubmit,
        setAllAmount,
        submit,
        numberInput,
        toReadMantissa,
        toPercent,
        toHumanReadable,
        getOracleValue,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import './modal.less';
</style>
