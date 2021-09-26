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
      <a-button class="btn input-box-btn" @click="setMaxAmount" v-if="!HasNoAsset">
        {{ $t('borrow.btn.max') }}
      </a-button>
    </div>
    <p class="error" v-if="NotEnoughErrorText">{{ NotEnoughErrorText }}</p>
    <p class="error" v-if="NotEnoughLiquidtyErrorText">{{ NotEnoughLiquidtyErrorText }}</p>
    <p class="error" v-if="OverRiskAssetConfigErrorText">{{ OverRiskAssetConfigErrorText }}</p>
    <p class="error" v-if="HasNoAsset">{{ $t('borrow.home.modal.hasNotAsset') }}</p>
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
      <!-- BorrowAPY  -->
      <div class="info-item">
        {{ $t('borrow.home.modal.borrowAPY') }}
        <span class="right">{{ token.borrowAPY }}</span>
      </div>

      <!-- Borrow Balance -->
      <div class="info-item">
        {{ $t('borrow.home.modal.borrowBalance') }}
        <span class="right">
          {{ token.borrowBalance.toNumber() }}
          <span class="arrow-box" v-if="amount != ''">
            <ArrowRightOutlined class="arrow" />
            {{ borrowBalanceUpdate }}
          </span>
        </span>
      </div>
      <!--  -->
      <div class="info-item">
        {{ $t('borrow.home.modal.borrowRate') }}
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
      <a-button
        class="btn submit-btn"
        :disabled="!canSubmit"
        @click="submit"
        :loading="btnLoading"
        v-if="!HasNoAsset"
      >
        {{ submitBtnText }}
      </a-button>

      <!-- Currently borrow -->
      <div class="info-item">
        {{ $t('borrow.home.modal.currentlyBorrowing') }}
        <span class="right" :class="{ highlight: isBorrowMode }">
          {{ token?.borrowBalance }} {{ token.name }}
        </span>
      </div>

      <!-- Wallet Balance -->
      <div class="info-item">
        {{ $t('borrow.home.modal.walletBalance') }}
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
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    token: {
      type: Object,
      default: () => {},
    },
  });

  const emit = defineEmits(['update:visible']);

  const { toHumanReadable, toReadableRiskMantissa, toPercent, getOracleValue } = useToken();
  const { startTransactionCheck } = useTransaction();
  const { assetId } = useUser();
  const { t } = useI18n();

  const ENUMS = inject('ENUMS');
  const emitter = inject('emitter');
  const messageModal = inject('$message');

  const { token } = reactive(props);

  const mode = ref(ENUMS.TAB_NAME.BORROW.value);
  const amount = ref('');
  const btnLoading = ref(false);
  const amountInput = ref(null);

  // Try update data when modal opened
  emitter.emit('refreshDataOnDuration');

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
  const submitBtnText = computed(() =>
    isBorrowMode.value ? t('borrow.btn.borrow') : t('borrow.btn.repay'),
  );
  const NotEnoughErrorText = computed(() => {
    if (amountGreatThanBalance.value) return t('borrow.home.modal.notEnoughBalance');
    return '';
  });
  const NotEnoughLiquidtyErrorText = computed(() => {
    return isBorrowMode.value && new BigNumber(amount.value).isGreaterThan(token.liquidity)
      ? t('borrow.home.modal.notEnoughLiquidity')
      : '';
  });

  const HasNoAsset = computed(() => !assetId.value);

  const OverRiskAssetConfigErrorText = computed(() => {
    return isBorrowMode.value &&
      new BigNumber(
        parseFloat(
          token.borrowedLimitUsedUpdatedOnBorrow((isBorrowMode.value ? 1 : -1) * amount.value),
        ),
      ).isGreaterThanOrEqualTo(
        toReadableRiskMantissa(token.riskAssetConfig.liquidation_threshold.mantissa).multipliedBy(
          100,
        ),
      )
      ? t('borrow.home.modal.overRiskAsset')
      : '';
  });

  const borrowBalanceUpdate = computed(() =>
    amount.value
      ? new BigNumber(token.borrowBalance)
          .plus((isBorrowMode.value ? 1 : -1) * amount.value)
          .toNumber()
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
      amount.value = token?.maxBorrowBalance().toNumber();
    }

    if (isRepayMode.value) {
      amount.value = token.maxRepayBalance.toNumber();
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
        messageModal.success(`${t('borrow.home.modal.transactionSuccess')}!`);
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
        messageModal.success(`${t('borrow.home.modal.transactionSuccess')}!`);
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
