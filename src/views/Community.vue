<template>
  <div class="community">
    <div class="top">
      <div class="left">
        <div class="title">
          {{ $t('community.joinLeftText') }}
          <img src="../assets/images/community/mobius-text.png" class="logo" />
          {{ $t('community.joinRightText') }}
        </div>
        <div class="content">{{ $t('community.intro') }}</div>
        <div class="btn big-btn more">
          {{ $t('btn.more') }}
        </div>
      </div>
      <img src="../assets/images/community/banner.png" class="right-banner" />
    </div>
    <div class="intro-banner btns">
      <div class="center-container">
        <div class="left" v-for="btn in btnsList" :key="btn">
          <div class="btn big-btn" :class="[btn]">
            {{ $t(`btn.${btn}`) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {},
    setup() {
      const btnsList = ['whitepaper', 'borrow', 'forum', 'resource'];

      return {
        btnsList,
      };
    },
  });
</script>

<style lang="less" scoped>
  .community {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    background-color: #f6fbfc;

    .top {
      display: flex;
      justify-content: center;
      margin-top: 66px;
      padding-bottom: 45px;

      .left {
        margin-right: 90px;

        .title {
          display: flex;
          align-items: baseline;
          margin-bottom: 24px;

          .logo {
            width: 217px;
            margin: 0 10px;
          }
          font-size: 36px;
        }

        .content {
          width: 384px;
          font-weight: 300;
          font-size: 18px;
          line-height: 35px;
          margin-bottom: 30px;
        }
      }
    }

    .intro-banner {
      flex-wrap: wrap;
      .big-btn {
        font-weight: normal;
        text-align: inter-word;
      }
    }

    .right-banner {
      max-width: 630px;
    }
  }
</style>
