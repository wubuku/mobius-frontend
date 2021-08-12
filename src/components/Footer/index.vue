<template>
  <div class="m-footer">
    <div class="m-footer-container">
      <div class="i18n">
        <div class="lan-item" @click="switchLanguage('en')">English</div>
        <div class="lan-item" @click="switchLanguage('zh')">中文</div>
      </div>

      <div class="offical-icon">
        <div class="icon tele"></div>
        <div class="icon twitter"></div>
        <div class="icon github"></div>
      </div>

      <div class="link-box">
        <div class="link-list" v-for="(list, index) in footerLinks" :key="index">
          <div class="link-list-title">{{ list.title }}</div>
          <a
            :href="linkObj.link"
            class="link-list-item"
            v-for="(linkObj, index) in list.links"
            :key="index"
          >
            {{ linkObj.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, getCurrentInstance } from 'vue';
  import { useI18n } from 'vue-i18n';
  import FooterLinks from 'config/FooterLinks';

  export default defineComponent({
    props: {},
    setup() {
      const { t } = useI18n();
      const { $i18n } = getCurrentInstance().appContext.config.globalProperties;

      const switchLanguage = (locale) => {
        $i18n.locale = locale;
        window.localStorage.setItem('locale', $i18n.locale);
      };

      return {
        i18n: $i18n,
        footerLinks: FooterLinks(t),
        switchLanguage,
      };
    },
  });
</script>

<style lang="less" scoped>
  .m-footer {
    width: 100%;
    height: 300px;
    background-color: #2f2f2f;
    display: flex;
    justify-content: center;
    align-items: center;

    .m-footer-container {
      width: 100%;
      max-width: 722px;
      display: flex;
      color: #fff;
      font-size: 14px;
      line-height: 16px;

      .i18n {
        margin-right: 50px;
        .lan-item {
          margin-bottom: 15px;
          cursor: pointer;

          &:active,
          &:hover {
            color: var(--themeColor);
          }
        }
      }

      .offical-icon {
        margin-right: 160px;
        .icon {
          cursor: pointer;
          width: 25px;
          height: 25px;
          background: url('../../assets/images/icon/tele.png') 0 0 / cover no-repeat;
          margin-bottom: 20px;

          &.twitter {
            background-image: url('../../assets/images/icon/twitter.png');
          }

          &.github {
            background-image: url('../../assets/images/icon/github.png');
          }
        }
      }

      .link-box {
        flex: 1;
        display: flex;
        justify-content: space-between;

        .link-list {
          display: flex;
          flex-direction: column;

          .link-list-title {
            margin-bottom: 16px;
            font-size: 14px;
            line-height: 16px;
            color: #ffffff;
          }

          .link-list-item {
            margin-bottom: 14px;
            font-size: 12px;
            color: #9ca5b3;
          }
        }
      }
    }
  }
</style>
