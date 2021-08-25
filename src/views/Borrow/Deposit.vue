<template>
  <div class="b-deposit deposit-page">
    <a-card class="left">
      <a-tabs type="card" class="tab-box" v-model:activeKey="mode">
        <a-tab-pane
          :key="ENUMS.TAB_NAME.DEPOSIT.value"
          :tab="$t(`borrow.tab.${ENUMS.TAB_NAME.DEPOSIT.value}`)"
        ></a-tab-pane>
        <a-tab-pane
          :key="ENUMS.TAB_NAME.WITHDRAW.value"
          :tab="$t(`borrow.tab.${ENUMS.TAB_NAME.WITHDRAW.value}`)"
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

        <p v-if="isDepositMode && currentResource.name">
          当前账户余额: {{ currentResource.amount }} {{ currentResource.name }}
        </p>

        <template v-if="!isDepositMode">
          <p v-if="currentWithdraw.address">
            当前可取:
            <!-- 这里是要计算出来的 -->
            {{ maxWithdrawAmount }}
            {{ currentWithdraw.name }}
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
  import useQueryStore from 'uses/useQueryStore';
  import { useStore } from 'vuex';

  export default defineComponent({
    props: {},
    setup() {
      const $message = inject('$message');
      const store = useStore();
      const { tokenList, toHumanReadable } = useToken();
      const { accountHash, myResource, currentResource, collateralList, assetId } = useUser();
      const {
        parseQuery,
        query,
        mode,
        amount,
        isDepositMode,
        isWithdrawMode,
        selectedToken,
        selectedTokenWatchHandler,
        tokenListWatchHandler,
      } = useQueryStore();

      const route = useRoute();
      const router = useRouter();
      const emitter = inject('emitter');
      const ENUMS = inject('ENUMS');

      // data
      const btnLoading = ref(false);

      // computed
      const canSubmit = computed(
        () => !!selectedToken.value.name && amount.value > 0 && !inputLargerThanAmount.value,
      );

      const maxWithdrawAmount = computed(() =>
        toHumanReadable({
          address: currentWithdraw.value.address,
          amount: currentWithdraw.value.token_amount,
        }),
      );

      const inputLargerThanAmount = computed(() => {
        return isDepositMode.value
          ? amount.value > currentResource.value.amount
          : amount.value > maxWithdrawAmount.value;
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
          collateralList.value.find((item) => item.address == selectedToken.value.address) || {}
        );
      });

      emitter.on('updateAccountHash', () => {
        getMyResource();
      });

      // watch
      watch(selectedToken, () => {
        selectedTokenWatchHandler();
        getMyResource();
      });

      watch(tokenList, () => {
        tokenListWatchHandler({ tokenList });
      });

      // hook
      onMounted(() => {
        parseQuery({
          type: 'DEPOSIT',
          tokenList: tokenList.value,
        });
      });

      const formInit = () => {
        amount.value = '';
      };

      const getMyResource = () => {
        if (isDepositMode.value && accountHash.value) {
          myResource({
            account: accountHash.value,
            address: selectedToken.value.address,
          });
        }
      };

      // method
      const submit = () => {
        btnLoading.value = true;

        // Deposit or Withdraw
        if (isDepositMode.value) {
          if (!assetId.value) {
            InitAssetContract({
              token: selectedToken.value,
              amount: amount.value,
            })
              .then((res) => {
                addTxn({
                  txn: res,
                  address: selectedToken.value.address,
                  name: selectedToken.value.name,
                  oper: mode.value,
                  amount: amount.value,
                });
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
                addTxn({
                  txn: res,
                  address: selectedToken.value.address,
                  name: selectedToken.value.name,
                  oper: mode.value,
                  amount: amount.value,
                });
                formInit();
                emitter.emit('getPersonalAsset');
              })
              .finally(() => {
                btnLoading.value = false;
              });
          }
        } else {
          WithdrawContract({
            token: selectedToken.value,
            nftId: assetId.value,
            amount: amount.value === maxWithdrawAmount.value ? 0 : amount.value,
          })
            .then((res) => {
              addTxn({
                txn: res,
                address: selectedToken.value.address,
                name: selectedToken.value.name,
                oper: mode.value,
                amount: amount.value,
              });
              formInit();
              emitter.emit('getPersonalAsset');
            })
            .finally(() => {
              btnLoading.value = false;
            });
        }
      };

      const setAllAmount = () => {
        if (currentResource.value.name) {
          if (isDepositMode.value) {
            amount.value = currentResource.value.amount;
          }

          if (isWithdrawMode.value) {
            amount.value = maxWithdrawAmount.value;
          }
        }
      };

      return {
        mode,
        btnLoading,

        tokenList,
        selectedToken,

        amount,
        isDepositMode,
        currentResource,
        collateralList,
        currentWithdraw,
        ENUMS,

        // computed data
        canSubmit,
        submitBtnText,
        maxWithdrawAmount,
        inputLargerThanAmount,

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
</style>
