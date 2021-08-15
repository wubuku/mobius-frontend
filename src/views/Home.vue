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
        <div
          class="title"
          v-for="title in $t(`official.index[${index}].title`).split(' ')"
          :key="title"
        >
          {{ title }}
        </div>
        <div class="content">{{ $t(`official.index[${index}].content`) }}</div>
      </div>
      <div class="right">
        <img :src="banner" alt="" />
      </div>
    </div>
    <div class="intro-banner btns">
      <div class="center-container">
        <div class="left">
          <div class="btn big-btn wallet">
            {{ $t('official.btn.starmask-wallet') }}
          </div>
        </div>
        <div class="right">
          <div class="btn big-btn faq">
            {{ $t('official.btn.faq') }}
          </div>
        </div>
      </div>
    </div>
    <!-- Bottom Button -->
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Home',
    components: {},
    setup() {
      const banners = [
        require('../assets/images/index/banner-quiz.png'),
        require('../assets/images/index/banner-secure.png'),
        require('../assets/images/index/banner-governance.png'),
      ];

      return {
        banners,
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
</style>
