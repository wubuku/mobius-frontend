<template>
  <div class="dashboard">
    <div class="main">
      <!-- Header -->
      <header>
        <div>Dashboard</div>
        <div class="op">
          <connect-btn></connect-btn>
          <locale-switch></locale-switch>
        </div>
      </header>
      <!-- Account Box -->
      <div class="account-box">
        FAI Account
        <span class="vault-id" v-if="userVault.vault_id"># {{ userVault.vault_id }}</span>

        <a-button
          class="btn submit-btn enable-btn"
          v-if="!currentAccountHasVault"
          @click="createVaultClickHandler"
          :loading="createVaultLoading"
        >
          {{ $t('account.btn.Enable Vault') }}
        </a-button>
      </div>

      <div style="color: white">
        <h1 style="color: white">Total Info</h1>
        <p>userVault: {{ userVault }}</p>
        <p>vaultConfig: {{ vaultConfig }}</p>
        <p>ableToGenerate: {{ ableToGenerate }}</p>
        <p>collateralRatio: {{ collateralRatio }}</p>
        <p>ccr: {{ ccr }}</p>
        <p>maxWithdrawSTCBalance: {{ new BigNumber(maxWithdrawSTCBalance).dp(4) }}</p>
        <p>totalValueLocked: {{ totalValueLocked }}</p>
        <p>price: {{ price }}</p>
        <p>supplyFormLockedSTC: {{ supplyFormLockedSTC }}</p>
        <p>currentAccountHasVault: {{ currentAccountHasVault }}</p>
      </div>

      <!-- Basic Account Info -->
      <div class="account-info">
        <div class="account-info-item">
          <div class="account-info-item-title">
            <span class="account-info-item-title-text">{{ $t('account.Wallet Balance') }}</span>
            <span class="account-info-item-title-value">{{ walletBalance }} STC</span>
          </div>
        </div>
        <div class="account-info-item">
          <div class="account-info-item-title">
            <span class="account-info-item-title-text">
              {{ $t('account.Protocol Balance') }}
            </span>
            <!-- <span class="account-info-item-title-value">{{ userVault.borrowed_fai }} STC</span> -->
            <span class="account-info-item-title-value">
              {{ new BigNumber(maxWithdrawSTCBalance).dp(4) }} STC
            </span>
          </div>
        </div>
      </div>

      <div class="body">
        <!-- Vault Info -->
        <div class="panel-box">
          <!-- 1 -->
          <div class="panel">
            <p class="panel-title">{{ $t('account.Outstanding FAI debt') }}</p>
            <div class="panel-body">
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">
                  {{ $t('account.Current FAI Value') }}
                </span>
                <span class="panel-body-item-title-value">
                  {{ userVault.borrowed_fai }}
                </span>
                <span
                  class="btn submit-btn"
                  @click="mode = FAI_TAB_NAME.REPAY.value"
                  :loading="!btnLoading"
                >
                  Repay FAI
                </span>
              </div>
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">
                  {{ $t('account.Available To Generate') }}
                </span>
                <span class="panel-body-item-title-value">
                  {{ ableToGenerate }}
                </span>
                <span
                  class="btn submit-btn"
                  @click="mode = FAI_TAB_NAME.MINT.value"
                  :loading="!btnLoading"
                >
                  Mint FAI
                </span>
              </div>
            </div>
          </div>

          <!-- 2 -->
          <div class="panel">
            <p class="panel-title">
              {{ $t('account.Collateral Ratio') }}
              <span>( {{ collateralRatio }} % )</span>
            </p>

            <div class="panel-body">
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">
                  {{ $t('account.Minimum Collateral Ratio') }}
                </span>
                <span class="panel-body-item-title-value">{{ ccr }}%</span>
              </div>
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">{{ $t('account.Minting Fee') }}</span>
                <span class="panel-body-item-title-value">
                  {{ toHumanReadable(userVault.stability_fee_to_pay) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 3  -->
          <div class="panel">
            <p class="panel-title">{{ $t('account.STC Locked') }}</p>
            <div class="panel-body">
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">{{ $t('account.STC Locked') }}</span>
                <span class="panel-body-item-title-value">
                  {{ userVault.stc_locked_amount }}
                </span>
                <span
                  class="btn submit-btn"
                  @click="mode = FAI_TAB_NAME.SUPPLY.value"
                  :loading="!btnLoading"
                >
                  Supply
                </span>
              </div>
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">{{ $t('account.Able to withdraw') }}</span>
                <span class="panel-body-item-title-value">
                  {{ new BigNumber(maxWithdrawSTCBalance).dp(4) }}
                </span>
                <span
                  class="btn submit-btn"
                  @click="mode = FAI_TAB_NAME.WITHDRAW.value"
                  :loading="!btnLoading"
                >
                  Withdraw
                </span>
              </div>
            </div>
          </div>
          <!-- 4 -->
          <div class="panel">
            <p class="panel-title">{{ $t('account.STC Information') }}</p>
            <div class="panel-body">
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">{{ $t('account.TVL_STC') }}</span>
                <span class="panel-body-item-title-value">$ {{ totalValueLocked }}</span>
              </div>
              <div class="panel-body-item">
                <span class="panel-body-item-title-text">
                  {{ $t('account.Current Price(STC/USD)') }}
                </span>
                <span class="panel-body-item-title-value">$ {{ price }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--  From -->
        <div class="form-box">
          <div class="form-title">
            {{
              [FAI_TAB_NAME.SUPPLY.value, FAI_TAB_NAME.WITHDRAW.value].includes(mode.toUpperCase())
                ? 'STC'
                : 'FAI'
            }}
          </div>
          <div class="modal-tab">
            <div
              class="modal-tab-item"
              :class="{ active: isSupply }"
              @click="mode = FAI_TAB_NAME.SUPPLY.value"
            >
              {{ $t('account.tab.Supply') }}
            </div>
            <div
              class="modal-tab-item"
              :class="{ active: isMintMode }"
              @click="mode = FAI_TAB_NAME.MINT.value"
            >
              {{ $t('account.tab.Mint') }}
            </div>
            <div
              class="modal-tab-item"
              :class="{ active: isWithdrawMode }"
              @click="mode = FAI_TAB_NAME.WITHDRAW.value"
            >
              {{ $t('account.tab.Withdraw') }}
            </div>
            <div
              class="modal-tab-item"
              :class="{ active: isRepayMode }"
              @click="mode = FAI_TAB_NAME.REPAY.value"
            >
              {{ $t('account.tab.Repay') }}
            </div>
          </div>

          <!-- Input  -->
          <div class="input-box">
            <a-input
              class="amount"
              placeholder="0"
              v-model:value="amount"
              @input="() => (amount = numberInput(amount))"
              :bordered="false"
              :disabled="NoSupplyBalance"
              ref="amountInput"
            ></a-input>
            <a-button class="btn input-box-btn" @click="setMaxAmount">
              {{ $t('borrow.btn.max') }}
            </a-button>
          </div>

          <p class="error" v-if="!amounRangeValid">Not Enough Balance</p>
          <p class="error" v-if="isOverMaxSupplyLimit">Over Max Supply Limit</p>

          <!-- Supply Form -->
          <div class="modal-info" v-if="mode === FAI_TAB_NAME.SUPPLY.value">
            <div class="info-item">
              {{ $t('account.form.Collateral Locking') }}
              <span class="right">
                {{ userVault.stc_locked_amount }}
                <span
                  class="arrow-box"
                  v-if="!new BigNumber(supplyFormLockedSTC).isEqualTo(userVault.stc_locked_amount)"
                >
                  <ArrowRightOutlined class="arrow" />
                  {{ supplyFormLockedSTC }}
                </span>
                STC
              </span>
            </div>
            <div class="info-item">
              {{ $t('account.form.Available FAI limit') }}
              <!-- TODO: update calc -->
              <span class="right">
                {{ ableToGenerate }}

                <span
                  class="arrow-box"
                  v-if="!new BigNumber(ableToGenerateComputed).isEqualTo(ableToGenerate)"
                >
                  <ArrowRightOutlined class="arrow" />
                  {{ ableToGenerateComputed }}
                </span>
                FAI
              </span>
            </div>
            <div class="info-item">
              {{ $t('account.form.Minimum Collateral Ratio') }}
              <span class="right">{{ ccr }}%</span>
            </div>

            <a-button
              class="btn submit-btn"
              :disabled="!canSubmit"
              @click="submit"
              :loading="btnLoading"
            >
              {{ $t('account.tab.Supply') }}
            </a-button>

            <div class="info-item">
              {{ $t('account.Wallet Balance') }}
              <span class="right">{{ walletBalance }} STC</span>
            </div>
          </div>

          <!-- Mint Form -->
          <div class="modal-info" v-if="mode === FAI_TAB_NAME.MINT.value">
            <div class="info-item">
              {{ $t('account.form.Available FAI') }}
              <span class="right">
                {{ ableToGenerate }}
                <span
                  class="arrow-box"
                  v-if="!new BigNumber(ableToGenerateComputedOnMint).isEqualTo(ableToGenerate)"
                >
                  <ArrowRightOutlined class="arrow" />
                  {{ ableToGenerateComputedOnMint }}
                </span>
                FAI
              </span>
            </div>
            <div class="info-item">
              {{ $t('account.form.Collateral Ratio') }}
              <span class="right">{{ collateralRatio }}%</span>
            </div>

            <a-button
              class="btn submit-btn"
              :disabled="!canSubmit"
              @click="submit"
              :loading="btnLoading"
            >
              {{ $t('account.tab.Mint') }}
            </a-button>

            <div class="info-item">
              {{ $t('account.form.FAI Balance') }}
              <span class="right">{{ userVault.borrowed_fai }} FAI</span>
            </div>
          </div>

          <!-- Withdraw Form -->
          <div class="modal-info" v-if="mode === FAI_TAB_NAME.WITHDRAW.value">
            <div class="info-item">
              {{ $t('account.form.Available to withdraw') }}
              <span class="right">
                {{ new BigNumber(maxWithdrawSTCBalance).dp(4) }}
                <span class="arrow-box" v-if="amount">
                  <ArrowRightOutlined class="arrow" />
                  <!-- maxWithdrawSTCBalanceComputed -->
                  {{ maxWithdrawSTCBalanceComputed }}
                </span>
                STC
              </span>
            </div>

            <a-button
              class="btn submit-btn"
              :disabled="!canSubmit"
              @click="submit"
              :loading="btnLoading"
            >
              {{ $t('account.tab.Withdraw') }}
            </a-button>

            <div class="info-item">
              {{ $t('account.Protocol Balance') }}
              <!-- <span class="right">{{ userVault.borrowed_fai }} STC</span> -->
              <span class="right">
                {{ new BigNumber(maxWithdrawSTCBalance).dp(4) }}

                STC
              </span>
            </div>
          </div>

          <!-- Repay Form -->
          <div class="modal-info" v-if="mode === FAI_TAB_NAME.REPAY.value">
            <!-- <div class="info-item">
              {{ $t('account.form.FAI repaying') }}
              <span class="right">1000 STC</span>
            </div> -->
            <div class="info-item">
              {{ $t('account.form.Repay FAI balance') }}
              <span class="right">
                {{ userVault.borrowed_fai }}
                <span class="arrow-box" v-if="amount">
                  <ArrowRightOutlined class="arrow" />
                  {{ new BigNumber(userVault.borrowed_fai).minus(amount).toNumber() }}
                </span>
                FAI
              </span>
            </div>

            <a-button
              class="btn submit-btn"
              :disabled="!canSubmit"
              @click="submit"
              :loading="btnLoading"
            >
              {{ $t('account.tab.Repay') }}
            </a-button>

            <div class="info-item">
              {{ $t('account.form.FAI Balance') }}
              <span class="right">{{ userVault.borrowed_fai }} FAI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, defineProps, inject, reactive, ref, watch } from 'vue';
  import { ArrowRightOutlined } from '@ant-design/icons-vue';
  import ConnectBtn from 'comp/Borrow/ConnectBtn';
  import LocaleSwitch from 'comp/LocaleSwitch.vue';
  import {
    checkUserVaultIsExsit,
    getBalanceOfFaiInMarket,
    getMaxBorrowLimitOfFai,
    getUserVault,
    getVaultConfig,
    getBalance,
    getPrice,
    getSTCLocked,
    // Transaction
    createVault,
    depositFai,
    withdrawFai,
    mintFai,
    repayFai,
  } from 'service/BFlyService';
  import { maxWithdrawableSTC, maxCanMinit, calcAbleToGenerate } from 'utils/FAICalc';
  import { numberInput } from 'utils';
  import useUser from 'uses/useUser';
  import useTransaction from 'uses/useTransaction';

  import BigNumber from 'bignumber.js';
  import { useI18n } from 'vue-i18n';
  import { ENUMS } from 'config';

  const messageModal = inject('$message');

  const { accountHash } = useUser();
  const { startTransactionCheck } = useTransaction();
  const { t } = useI18n();
  const { FAI_TAB_NAME } = ENUMS;
  const amount = ref('');
  const amountInput = ref(null);
  const createVaultLoading = ref(false);
  const currentAccountHasVault = ref(false);
  const currentFaiValue = ref(0);
  const maxBorrowLimitOfFai = ref(0);
  const userVault = reactive({
    vault_id: '',
    borrowed_fai: 0,
    stability_fee_to_pay: 0,
    stc_locked_amount: 0,
    timestamp: 0,
  });
  const walletBalance = ref(0);
  const ableToGenerate = ref(0);
  const vaultConfig = ref({
    ccr: 0,
    liquidation_penalty: 0,
    liquidation_threshold: 0,
    max_deposit_per_vault: 0,
    max_fai_supply: 0,
    min_mint_amount: 0,
    stability_fee_ratio: 0,
  });
  const tvl = ref(0);
  const price = ref(0);
  const mode = ref(FAI_TAB_NAME.SUPPLY.value);
  const btnLoading = ref(false);

  // watch
  watch(accountHash, () => {
    initAccount();
    initApp();
  });

  watch(mode, () => {
    amount.value = '';
  });

  // Computed
  const totalValueLocked = computed(() => {
    console.log(tvl.value, price.value);
    return new BigNumber(tvl.value).multipliedBy(price.value).toNumber();
  });

  const isSupply = computed(() => {
    return mode.value === FAI_TAB_NAME.SUPPLY.value;
  });

  const isMintMode = computed(() => {
    return mode.value === FAI_TAB_NAME.MINT.value;
  });

  const isWithdrawMode = computed(() => {
    return mode.value === FAI_TAB_NAME.WITHDRAW.value;
  });

  const isRepayMode = computed(() => {
    return mode.value === FAI_TAB_NAME.REPAY.value;
  });

  // Form Computed
  const supplyFormLockedSTC = computed(() =>
    new BigNumber(userVault.stc_locked_amount).plus(amount.value || 0).toNumber(),
  );

  // 最大supply限制
  const isOverMaxSupplyLimit = computed(
    () =>
      isSupply.value &&
      new BigNumber(supplyFormLockedSTC.value) >
        toHumanReadable(vaultConfig.value.max_deposit_per_vault),
  );

  const collateralRatio = computed(() => {
    const mintFAIAmount = new BigNumber(userVault.borrowed_fai);
    if (mintFAIAmount == 0) return 0;

    return new BigNumber(userVault.stc_locked_amount)
      .multipliedBy(price.value)
      .dividedBy(userVault.borrowed_fai)
      .multipliedBy(100)
      .dp(4, BigNumber.ROUND_HALF_UP)
      .toNumber();
  });

  const collateralRatioComputed = computed(() => {
    const mintFAIAmount = new BigNumber(userVault.borrowed_fai).plus(amount.value || 0);
    if (mintFAIAmount == 0) return 0;

    return new BigNumber(userVault.stc_locked_amount)
      .multipliedBy(price.value)
      .dividedBy(new BigNumber(userVault.borrowed_fai).plus(amount.value || 0))
      .multipliedBy(100)
      .dp(4, BigNumber.ROUND_HALF_UP)
      .toNumber();
  });

  const ableToGenerateComputed = computed(() => {
    return !amount.value
      ? ableToGenerate.value
      : calcAbleToGenerate(
          maxCanMinit(
            new BigNumber(userVault.stc_locked_amount).plus(amount.value || 0).toNumber(),
            price.value,
            new BigNumber(ccr.value).dividedBy(100).toNumber(),
          ),
          userVault.borrowed_fai,
        );
  });

  // mint的时候计算剩下多少FAI可以被mint
  const ableToGenerateComputedOnMint = computed(() => {
    return new BigNumber(ableToGenerate.value).minus(amount.value || 0).toNumber();
  });

  const maxWithdrawSTCBalanceComputed = computed(() => {
    return new BigNumber(maxWithdrawSTCBalance.value)
      .minus(amount.value || 0)
      .dp(4)
      .toNumber();
  });

  // 输入数额范围
  const amounRangeValid = computed(() => {
    if (amount.value < 0) return false;

    let amountRange = true;
    let amountValue = amount.value || 0;
    switch (mode.value) {
      case FAI_TAB_NAME.SUPPLY.value:
        amountRange = new BigNumber(amountValue).isLessThanOrEqualTo(walletBalance.value);
        break;
      case FAI_TAB_NAME.MINT.value:
        // TODO: update
        amountRange = new BigNumber(amountValue).isLessThanOrEqualTo(ableToGenerate.value);
        break;
      case FAI_TAB_NAME.WITHDRAW.value:
        amountRange = new BigNumber(amountValue).isLessThanOrEqualTo(maxWithdrawSTCBalance.value);
        break;
      case FAI_TAB_NAME.REPAY.value:
        amountRange = new BigNumber(amountValue).isLessThanOrEqualTo(userVault.borrowed_fai);
        break;
    }

    return amountRange;
  });

  // 能否提交
  const canSubmit = computed(() => {
    // 超过最大限制
    if (isSupply.value && isOverMaxSupplyLimit.value) {
      return false;
    }
    //  开通了金库 而且 数额没有超过范围 而且 数额不为空
    return amounRangeValid.value && !!amount.value && currentAccountHasVault.value;
  });

  // ccr计算
  const ccr = computed(() => {
    return new BigNumber(vaultConfig.value.ccr).dividedBy(100).toNumber();
  });

  // 最大可提取数计算
  const maxWithdrawSTCBalance = computed(() =>
    maxWithdrawableSTC(
      userVault.stc_locked_amount,
      userVault.borrowed_fai,
      ccr.value / 100,
      price.value,
      toHumanReadable(userVault.stability_fee_to_pay),
    ),
  );

  // methods

  // 初始化账户信息
  const initAccount = async () => {
    currentAccountHasVault.value = await checkUserVaultIsExsit(accountHash.value);

    if (currentAccountHasVault.value) {
      maxBorrowLimitOfFai.value = toHumanReadable(await getMaxBorrowLimitOfFai(accountHash.value));
      /**
         *
            vault.id,
            vault.debt_mai_amount,
            vault.stability_fee_to_pay,
            vault.stc_locked_amount,
            Timestamp::now_seconds()
        */
      [
        userVault.vault_id = '',
        userVault.borrowed_fai = 0,
        userVault.stability_fee_to_pay = 0,
        userVault.stc_locked_amount = 0,
        userVault.timestamp,
      ] = await getUserVault(accountHash.value);

      userVault.borrowed_fai = toHumanReadable(userVault.borrowed_fai);
      userVault.stc_locked_amount = toHumanReadable(userVault.stc_locked_amount);

      walletBalance.value = toHumanReadable(await getBalance(accountHash.value));
    }
  };

  // 初始化app
  const initApp = async () => {
    vaultConfig.value = await getVaultConfig();

    const { decimals, latestPrice } = (await getPrice()).filter(
      (item) => item.pairId === 'STCUSD',
    )[0];
    price.value = new BigNumber(latestPrice).shiftedBy(-1 * decimals).toNumber();

    currentFaiValue.value = new BigNumber(await getBalanceOfFaiInMarket())
      .shiftedBy(-1 * decimals)
      .toNumber();

    tvl.value = toHumanReadable(await getSTCLocked());

    console.log(
      maxCanMinit(
        userVault.stc_locked_amount,
        price.value,
        new BigNumber(ccr.value).dividedBy(100).toNumber(),
      ),

      userVault.borrowed_fai,
    );

    ableToGenerate.value = calcAbleToGenerate(
      maxCanMinit(
        userVault.stc_locked_amount,
        price.value,
        new BigNumber(ccr.value).dividedBy(100).toNumber(),
      ),
      userVault.borrowed_fai,
    );
  };

  // 创建Vault点击
  const createVaultClickHandler = async () => {
    createVaultLoading.value = true;
    try {
      await startTransactionCheck(await createVault(accountHash.value));
      messageModal.success(`${t('account.message.Create Vault Success')}`);
      reloadPage();
    } catch (e) {
      console.log(e);
    }
    createVaultLoading.value = false;
  };

  const toHumanReadable = (amount) => {
    return new BigNumber(amount).shiftedBy(-9).dp(4, BigNumber.ROUND_UP).toNumber();
  };

  const toChainReadable = (amount) => {
    return new BigNumber(amount).shiftedBy(9).dp(0, BigNumber.ROUND_UP).toNumber();
  };

  // 最大按钮点击
  const setMaxAmount = () => {
    switch (mode.value) {
      case FAI_TAB_NAME.SUPPLY.value:
        amount.value = walletBalance.value;
        break;
      case FAI_TAB_NAME.WITHDRAW.value:
        amount.value = maxWithdrawSTCBalance.value;
        break;
      case FAI_TAB_NAME.MINT.value:
        amount.value = ableToGenerate.value;
        break;
      case FAI_TAB_NAME.REPAY.value:
        amount.value = userVault.borrowed_fai;
        break;
    }
  };

  // 提交
  const submit = async () => {
    btnLoading.value = true;
    try {
      let txn = '';
      let msg = '';
      switch (mode.value) {
        case FAI_TAB_NAME.SUPPLY.value:
          txn = await depositFai(toChainReadable(amount.value));
          msg = t('account.message.supplySuccess');
          break;
        case FAI_TAB_NAME.MINT.value:
          txn = await mintFai(
            toChainReadable(
              new BigNumber(amount.value).isEqualTo(ableToGenerate.value) ? 0 : amount.value,
            ),
          );
          msg = t('account.message.mintSuccess');
          break;
        case FAI_TAB_NAME.WITHDRAW.value:
          console.log(amount.value, maxWithdrawSTCBalance.value);
          txn = await withdrawFai(
            toChainReadable(
              new BigNumber(amount.value).isEqualTo(maxWithdrawSTCBalance.value) ? 0 : amount.value,
            ),
          );
          msg = t('account.message.withdrawSuccess');
          break;
        case FAI_TAB_NAME.REPAY.value:
          txn = await repayFai(
            toChainReadable(
              // 全部还完, 传0
              new BigNumber(amount.value).isEqualTo(userVault.borrowed_fai) ? 0 : amount.value,
            ),
          );
          msg = t('account.message.repaySuccess');
          break;
      }

      await startTransactionCheck(txn);
      messageModal.success(msg);
      amount.value = '';
      reloadPage();
    } catch (err) {
      if (err.message) {
        messageModal.error(err.message);
      }
    }

    btnLoading.value = false;
  };

  // 重新加载页面
  const reloadPage = () => {
    initAccount();
    initApp();
  };

  reloadPage();
</script>

<style lang="less" scoped>
  @import '../assets/style/app';
  @import '../components/modal/modal';
  @import '../assets//style/deposit';

  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #000228;
    color: white;
    font-family: D-DINCondensed;
    font-size: 20px;

    .main {
      width: 100%;
      max-width: 1300px;
      min-height: 100vh;
      padding: 100px 20px;

      header {
        display: flex;
        align-items: center;

        .op {
          margin-left: auto;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
      }
    }

    .account-box {
      display: flex;
      align-items: center;
      font-size: 50px;

      .vault-id {
        padding: 0 0 0 20px;
      }

      .enable-btn {
        min-width: 150px;
        height: 40px;
        margin-left: 20px;
      }
    }

    .account-info {
      display: flex;
      width: 100%;
      line-height: 20px;

      .account-info-item {
        margin-right: 10px;
        border-right: 1px solid white;
        padding-right: 10px;
        color: #cccccc;

        &:last-child {
          border: none;
        }

        .account-info-item-title-value {
          color: white;
          margin-left: 10px;
        }
      }
    }

    .body {
      display: flex;
      margin: 50px 0;

      .panel-box {
        width: 756px;
        height: 480px;
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;

        .panel {
          width: 48%;
          padding: 20px 15px;
          border-radius: 10px;
          border: 1px solid #ccccccc3;
          margin-right: 2%;
          margin-bottom: 10px;

          .panel-title {
            font-size: 20px;
            margin-bottom: 30px;
            color: #cccccc;
          }

          .panel-body-item {
            margin: 10px 0;
            display: flex;

            .panel-body-item-title-value {
              margin-left: auto;
              padding: 0 10px;
            }
          }

          .submit-btn {
            min-height: auto;
          }
        }
      }
    }

    .submit-btn {
      margin-left: auto;
      height: auto;
      min-height: 20px;
      min-width: 90px;
      max-width: 90px;
      padding: 0 10px;
      font-size: 18px;
      border-radius: 5px;
      flex-shrink: 0;
      margin: 0;
      color: #eeeeee;
    }

    .form-box {
      min-width: 425px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #ccccccc3;
      border-radius: 10px;
      padding-bottom: 20px;

      .form-title {
        width: 100%;
        font-size: 40px;
        border-bottom: 1px solid #ccccccc3;
        text-align: center;
      }

      .input-box {
        margin-top: 20px;

        .amount {
          width: 310px;
        }

        .input-box-btn {
          right: 45px;
        }
      }

      .modal-tab {
        width: 90%;
        border-bottom: none;
        margin-top: 20px;

        .modal-tab-item {
          font-size: 20px;
          border-radius: 5px;
          border-bottom: 0;
          margin: 0 10px;

          &.active,
          &:hover {
            background-color: #efaf4e;
          }
        }
      }
    }

    .modal-info {
      width: 90%;
      padding: 10px 20px;
      margin: 0 auto 20px;
      min-height: auto;

      .info-item {
        margin: 5px 0;
        line-height: 30px;
        font-size: 20px;

        .right {
          min-height: auto;
          height: 24px;
          background-color: transparent;
          margin-left: auto;
          width: auto;
          min-width: auto;
          color: white;
        }
      }

      // override
      .submit-btn {
        width: 100%;
        max-width: initial;
        min-height: 44px;
        margin: 20px;
        font-size: 24px;
        font-weight: bolder;
      }
    }
  }
</style>
