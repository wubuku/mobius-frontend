<template>
  <a-modal
    v-bind="$attrs"
    :title="token.name"
    :closable="!btnLoading"
    :maskClosable="!btnLoading"
    :footer="null"
    @cancel="emit('update:visible', false)"
    width="500px"
    centered
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
      <!-- Supply APY -->
      <div class="info-item">
        存款APY
        <span class="right">{{ token.supplyAPY }}</span>
      </div>

      <!-- <div class="info-item">
        Distribution APY
        <span class="right">1.24%</span>
      </div> -->

      <!-- Borrow Limit -->
      <div class="info-item">
        Borrow Limit
        <span class="right">
          $0
          <span class="arrow-box" v-if="borrowLimit != 0">
            <ArrowRightOutlined class="arrow" />
            ${{ borrowLimit }}
          </span>
        </span>
      </div>

      <!-- Borrow Limit Used -->
      <div class="info-item">
        Borrow Limit Used ((Borrowed u + Borrow Limit above )/ Borrowed Balance u )
        <span class="right highlight">0%</span>
      </div>

      <!-- Submit Btn -->
      <a-button class="btn submit-btn" :disabled="!canSubmit" @click="submit" :loading="btnLoading">
        {{ submitBtnText }}
      </a-button>

      <!-- Currently withdraw -->
      <div class="info-item">
        Currently Supplying
        <span class="right" :class="{ highlight: isDepositMode }">
          {{ token?.supplyBalance }} {{ token.name }}
        </span>
      </div>

      <!-- Wallet Balance -->
      <div class="info-item">
        Wallet Balance
        <span class="right" :class="{ highlight: isWithdrawMode }">
          {{ token?.walletResource }} {{ token.name }}
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import BigNumber from 'bignumber.js';
  import { computed, defineProps, defineEmits, inject, reactive, ref, watch } from 'vue';
  import { numberInput } from 'utils';
  import { maxWithdrawCalc } from 'utils/Calc';
  import { ArrowRightOutlined } from '@ant-design/icons-vue';
  import { DepositContract, WithdrawContract, InitAssetContract } from 'service/BorrowService';
  import useToken from '../../uses/useToken';
  import useUser from '../../uses/useUser';
  import useTransaction from '../../uses/useTransaction';

  const props = defineProps({
    token: {
      type: Object,
      default: () => {},
    },
  });

  const emit = defineEmits(['update:visible']);

  const { toHumanReadable, toReadMantissa, toPercent, getBorrowLimit } = useToken();
  const { startTransactionCheck } = useTransaction();
  const { assetId } = useUser();

  const ENUMS = inject('ENUMS');
  const emitter = inject('emitter');
  const messageModal = inject('$message');

  const { token } = reactive(props);

  const mode = ref(ENUMS.TAB_NAME.DEPOSIT.value);
  const amount = ref('');
  const borrowLimit = ref('');
  const btnLoading = ref(false);
  const amountInput = ref(null);

  const isDepositMode = computed(() => mode.value === ENUMS.TAB_NAME.DEPOSIT.value);
  const isWithdrawMode = computed(() => mode.value === ENUMS.TAB_NAME.WITHDRAW.value);
  const inputLargerThanAmount = computed(() => {
    return isDepositMode.value
      ? new BigNumber(amount.value).isGreaterThan(token?.walletResource)
      : new BigNumber(amount.value).isGreaterThan(token?.supplyBalance);
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

  watch(amount, () => {
    borrowLimit.value = getBorrowLimit({
      amount: amount.value || 0,
      oracle: token.oracle,
    }).multipliedBy(isDepositMode.value ? 1 : -1);
  });

  const setAllAmount = () => {
    if (isDepositMode.value) {
      amount.value = token?.walletResource;
    }

    if (isWithdrawMode.value) {
      const { mantissa: market_index = 0 } = token?.rate?.vec[0]?.supply_index || {};
      const { interest = 0, rate = {} } = token?.personalCollateralAsset || {};
      const { mantissa: user_index = 0 } = rate?.vec[0]?.index || {};

      // 要算利息 朋友
      amount.value = BigNumber.minimum(
        maxWithdrawCalc(
          token?.supplyBalance,
          toReadMantissa(market_index),
          toReadMantissa(user_index),
          toReadMantissa(interest),
        ),
        token?.supplyBalance,
      ).valueOf();
    }
  };

  const onCancel = () => {
    amount.value = '';
    btnLoading.value = false;
    emit('update:visible', false);
  };

  const submit = async () => {
    btnLoading.value = true;

    // Deposit or Withdraw
    if (isDepositMode.value) {
      if (!assetId.value) {
        try {
          const txn = await InitAssetContract({
            token: token,
            amount: amount.value,
          });
          await startTransactionCheck(txn);
          onCancel();
          emitter.emit('refreshData');
          messageModal.success('Transaction Success!');
        } catch (err) {
          if (err.message) {
            messageModal.error(err.message);
          }
        }
      } else {
        try {
          const txn = await DepositContract({
            token: token,
            nftId: assetId.value,
            amount: amount.value,
          });
          await startTransactionCheck(txn);
          onCancel();
          emitter.emit('refreshData');
          messageModal.success('Transaction Success!');
        } catch (err) {
          if (err.message) {
            messageModal.error(err.message);
          }
        }
      }
    } else {
      try {
        const txn = await WithdrawContract({
          token: token,
          nftId: assetId.value,
          amount: new BigNumber(amount.value).isEqualTo(token?.supplyBalance) ? 0 : amount.value,
        });
        await startTransactionCheck(txn);
        onCancel();
        emitter.emit('refreshData');
        messageModal.success('Transaction Success!');
      } catch (err) {
        if (err.message) {
          messageModal.error(err.message);
        }
      }
    }

    btnLoading.value = false;
  };
</script>

<style lang="less" src="./modal.less" scoped></style>
