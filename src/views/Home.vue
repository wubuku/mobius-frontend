<template>
  <div class="home">
    <!-- Top Banner -->
    <img src="../assets/images/index/banner-top.jpg" class="top-banner" />
    <!-- Intro Banner -->
    <div
      class="intro-banner"
      v-for="(banner, index) in banners"
      :key="index"
      :class="{ reverse: index % 2 }"
    >
      <div class="left">
        <div class="title" v-for="title in t(`index[${index}].title`).split(' ')" :key="title">
          {{ title }}
        </div>
        <div class="content">{{ t(`index[${index}].content`) }}</div>
      </div>
      <div class="right">
        <img :src="banner" alt="" />
      </div>
    </div>
    <div class="intro-banner btns">
      <div class="left">
        <div class="btn big-btn wallet">
          {{ t('btn.starmask-wallet') }}
        </div>
      </div>
      <div class="right">
        <div class="btn big-btn faq">
          {{ t('btn.faq') }}
        </div>
      </div>
    </div>
    <!-- Bottom Button -->
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'Home',
    components: {},
    setup() {
      const { t } = useI18n();
      const banners = [
        require('../assets/images/index/banner-quiz.png'),
        require('../assets/images/index/banner-secure.png'),
        require('../assets/images/index/banner-governance.png'),
      ];

      return {
        banners,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .top-banner {
    width: 100%;
    max-width: 1440px;
  }

  .intro-banner {
    display: flex;
    width: 100%;
    height: 455px;
    justify-content: center;
    align-items: center;
    background: var(--bannerColor);
    user-select: none;

    .left {
      width: 460px;
      margin-right: 100px;

      .title {
        font-weight: 900;
        font-size: 40px;
        line-height: 1.2;
        letter-spacing: 6px;
        color: #4b4d51;
      }

      .content {
        font-style: normal;
        font-weight: 300;
        font-size: 18px;
        line-height: 2;
        color: #51afc6;
        margin-top: 25px;
      }
    }

    .right {
      img {
        width: 425px;
      }
    }

    &.btns {
      height: 290px;

      .left,
      .right {
        width: 550px;
        margin-right: 0;
        display: flex;
        justify-content: center;
      }
    }

    .big-btn {
      width: 320px;
      height: 72px;
      background: var(--themeColor);
      border-radius: 80px;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 200;

      &:before {
        width: 25px;
        height: 25px;
        content: '';
        display: block;
        background: url('../assets/images/icon/wallet.png') 0 0 / contain no-repeat;
        margin-right: 15px;
      }

      &.faq {
        background: white;
        color: #4b4d51;

        &:before {
          background: url('../assets/images/icon/faq.png') 0 0 / contain no-repeat;
        }
      }
    }

    &.reverse {
      flex-direction: row-reverse;
      background-color: transparent;
      .left {
        margin-right: 0;
      }
      .right {
        margin-right: 100px;
      }
    }
  }
</style>
