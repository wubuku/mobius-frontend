<template>
  <a-modal
    v-bind="$attrs"
    :title="token.name"
    :closable="!btnLoading"
    :maskClosable="!btnLoading"
    :footer="null"
    @cancel="onCancel"
    width="500px"
    centered
  >
    <!-- <span style="color: white; font-size: 24px">
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
      <a-button class="btn input-box-btn" @click="setMaxAmount">MAX</a-button>
    </div>
    <p class="error" v-if="NotEnoughErrorText">{{ NotEnoughErrorText }}</p>
    <p class="error" v-if="NotEnoughLiquidtyErrorText">{{ NotEnoughLiquidtyErrorText }}</p>
    <p class="error" v-if="OverRiskAssetConfigErrorText">{{ OverRiskAssetConfigErrorText }}</p>
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
        <span class="right">{{ token.borrowAPY }}</span>
      </div>
      <!-- <div class="info-item">
        Distribution APY
        <span class="right">1.24%</span>
      </div> -->

      <!--  -->
      <div class="info-item">
        Borrow Balance
        <span class="right">
          {{ token.borrowBalance }}
          <span class="arrow-box" v-if="borrowBalanceUpdate != 0">
            <ArrowRightOutlined class="arrow" />
            {{ borrowBalanceUpdate }}
          </span>
        </span>
      </div>
      <!--  -->
      <div class="info-item">
        已用比例
        <span class="right highlight">
          {{ token.borrowedLimitUsed }}
          <span
            class="arrow-box"
            v-if="token.borrowedLimitUsedUpdatedOnBorrow((isBorrowMode ? 1 : -1) * amount) != 0"
          >
            <ArrowRightOutlined class="arrow" />
            {{ token.borrowedLimitUsedUpdatedOnBorrow((isBorrowMode ? 1 : -1) * amount) }}
          </span>
        </span>
      </div>
      <!--  -->
      <a-button class="btn submit-btn" :disabled="!canSubmit" @click="submit" :loading="btnLoading">
        {{ submitBtnText }}
      </a-button>

      <!-- Currently borrow -->
      <div class="info-item">
        Currently Borrowing
        <span class="right" :class="{ highlight: isBorrowMode }">
          {{ token?.borrowBalance }} {{ token.name }}
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

<script setup>
  import BigNumber from 'bignumber.js';
  import { computed, defineProps, defineEmits, inject, reactive, ref, watch } from 'vue';
  import { numberInput } from 'utils';
  import { ArrowRightOutlined } from '@ant-design/icons-vue';
  import { BorrowContract, RepayContract } from 'service/BorrowService';
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

  const { toHumanReadable, toReadMantissa, toPercent, getOracleValue } = useToken();
  const { startTransactionCheck } = useTransaction();
  const { assetId } = useUser();

  const ENUMS = inject('ENUMS');
  const emitter = inject('emitter');
  const messageModal = inject('$message');

  const { token } = reactive(props);

  const mode = ref(ENUMS.TAB_NAME.BORROW.value);
  const amount = ref('');
  const btnLoading = ref(false);
  const amountInput = ref(null);

  const isBorrowMode = computed(() => mode.value === ENUMS.TAB_NAME.BORROW.value);
  const isRepayMode = computed(() => mode.value === ENUMS.TAB_NAME.REPAY.value);

  const amountGreatThanBalance = computed(() => {
    if (isRepayMode.value) {
      return (
        // 钱包小于输入值
        token?.walletResource.minus(amount.value).isLessThan(0) ||
        // 已借的小于输入值
        token.borrowBalance.minus(amount.value).isLessThan(0)
      );
    }
    return false;
  });

  const canSubmit = computed(
    () =>
      amount.value != '' &&
      amount.value > 0 &&
      !NotEnoughErrorText.value &&
      !NotEnoughLiquidtyErrorText.value &&
      !OverRiskAssetConfigErrorText.value,
  );
  const submitBtnText = computed(() => (isBorrowMode.value ? 'Borrow' : 'Repay'));
  const NotEnoughErrorText = computed(() => {
    if (amountGreatThanBalance.value) return 'Not enough balance';
    return '';
  });

  const NotEnoughLiquidtyErrorText = computed(() => {
    return isBorrowMode.value && new BigNumber(amount.value).isGreaterThan(token.liquidity)
      ? 'Not enough liquidity'
      : '';
  });

  const OverRiskAssetConfigErrorText = computed(() => {
    return isBorrowMode.value &&
      parseFloat(
        token.borrowedLimitUsedUpdatedOnBorrow((isBorrowMode.value ? 1 : -1) * amount.value),
      ) >= toReadMantissa(token.riskAssetConfig.liquidation_threshold.mantissa).multipliedBy(100)
      ? 'Over risk Asset'
      : '';
  });

  const borrowBalanceUpdate = computed(() =>
    amount.value
      ? new BigNumber(token.borrowBalance).plus((isBorrowMode.value ? 1 : -1) * amount.value)
      : 0,
  );

  const totalBalance = computed(() => {
    if (amount.value == 0) return 0;
    const currentBalance = new BigNumber(
      toHumanReadable({
        amount: token.debt?.debtAsset?.token_amount || 0,
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

  const setMaxAmount = () => {
    if (isBorrowMode.value) {
      amount.value = token?.maxBorrowBalance().valueOf();
    }

    if (isRepayMode.value) {
      amount.value = token.maxRepayBalance.valueOf();
    }
  };

  const onCancel = () => {
    amount.value = '';
    btnLoading.value = false;
    emit('update:visible', false);
  };

  const submit = async () => {
    btnLoading.value = true;

    // Borrow or epay
    if (isBorrowMode.value) {
      try {
        const txn = await BorrowContract({
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
    } else if (isRepayMode.value) {
      try {
        const txn = await RepayContract({
          token: token,
          nftId: assetId.value,
          amount: new BigNumber(amount.value).isEqualTo(token.maxRepayBalance) ? 0 : amount.value,
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
