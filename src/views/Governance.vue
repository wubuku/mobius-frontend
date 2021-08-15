<template>
  <div class="governance">
    <div class="intro-banner">
      <div class="center-container">
        <img src="../assets/images/governance/banner.png" class="banner" />
        <div class="info">
          <h3>{{ $t('official.governance.my') }}</h3>
          <p class="number">100</p>
          <div class="btn suffrage">{{ $t('official.governance.suffrage') }}</div>
        </div>
        <div class="btn big-btn vote">
          {{ $t('official.governance.vote') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {},
    setup() {},
  });
</script>

<style lang="less" scoped>
  .governance {
    .intro-banner {
      height: 200px;
      background-color: rgba(#51afc6, 0.1);

      .center-container {
        justify-content: space-between;
        align-items: center;
      }

      .banner {
        width: 234px;
        left: 40px;
        position: relative;
      }

      .info {
        display: flex;
        flex-direction: column;
        align-items: center;

        h3 {
          font-size: 24px;
          line-height: 28px;
          color: #4b4d51;
        }

        .number {
          font-family: Kanit;
          font-style: normal;
          font-weight: 500;
          font-size: 60px;
          line-height: 60px;
          color: #e5659b;
          margin-bottom: 20px;
        }

        .suffrage {
          width: 70px;
          height: 24px;
          background: #ffffff;
          border-radius: 16px;
          text-align: center;
          color: var(--themeColor);
        }
      }
    }
  }

  .btn.big-btn.vote {
    width: 195px;
    height: 60px;
  }
</style>
