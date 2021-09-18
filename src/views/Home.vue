<template>
  <div class="home">
    <div class="container">
      <img src="../assets/images/index/c2.png" class="c2" />

      <!-- Header -->
      <header>
        <div class="logo">BFLY.FINANCE</div>
        <div class="menu">
          <span class="menu-item">
            <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">
              {{ $t('official.menus.market') }}
            </router-link>
          </span>
          <span class="menu-item">
            <a href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-whitepaper" target="_blank">
              {{ $t('official.menus.docs') }}
            </a>
          </span>
          <span class="menu-item">{{ $t('official.menus.governance') }}</span>
          <span class="menu-item">
            <a href="https://b-fly.gitbook.io/b-fly/protocol-security" target="_blank">
              {{ $t('official.menus.security') }}
            </a>
          </span>
          <div class="btn menu-item">
            <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">
              {{ $t('official.btn.app') }}
            </router-link>
          </div>
          <locale-switch class="header-local-switch"></locale-switch>
        </div>
      </header>
      <!-- Banner -->
      <div class="banner">
        <div class="title">
          <img src="../assets/images/index/B-FLYProtocol.png" alt="" />
        </div>
        <div class="desc">
          {{ $t('official.index.bannerDesc') }}
        </div>

        <div class="btn protocal">
          <a
            href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-whitepaper#the-b-fly-protocol"
            target="_blank"
          >
            {{ $t('official.btn.protocalDocs') }}
          </a>
        </div>
      </div>
      <!-- Market -->
      <div class="money-market">
        <div class="top">
          <div class="coin-list">
            <!-- STC -->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'STC' } })"
            >
              <img src="../assets/images/coin/stc.png" class="token-icon" />
              <div class="name">
                <h2>Starcoin</h2>
                <span>STC</span>
              </div>
              <div class="apy">
                <span class="value">{{ apys['STC'] }}</span>
                <span>APY</span>
              </div>
            </div>
            <!-- ETH -->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'METH' } })"
            >
              <img src="../assets/images/coin/meth.png" class="token-icon" />
              <div class="name">
                <h2>Ether</h2>
                <span>ETH</span>
              </div>
              <div class="apy">
                <span class="value">{{ apys['METH'] }}</span>
                <span>APY</span>
              </div>
            </div>
            <!-- BTC-->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'MBTC' } })"
            >
              <img src="../assets/images/coin/mbtc.png" class="token-icon" />
              <div class="name">
                <h2>Bitcoin</h2>
                <span>BTC</span>
              </div>
              <div class="apy">
                <span class="value">{{ apys['MBTC'] }}</span>
                <span>APY</span>
              </div>
            </div>
            <!-- USDT -->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'MUSDT' } })"
            >
              <img src="../assets/images/coin/musdt.png" class="token-icon" />
              <div class="name">
                <h2>Tether</h2>
                <span>USDT</span>
              </div>
              <div class="apy">
                <span class="value">{{ apys['MUSDT'] }}</span>
                <span>APY</span>
              </div>
            </div>
            <div class="btn view-more">
              <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">View More</router-link>
            </div>
          </div>
          <div class="right-part">
            <h1>
              <img
                src="../assets/images/index/MoneyMarkets.png"
                style="max-width: 599px; width: 100%"
              />
            </h1>
            <div class="market-desc">
              {{ $t('official.index.marketDesc') }}
            </div>
            <div class="btn protocal">
              <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">Launch App</router-link>
            </div>
          </div>
        </div>
        <h2 class="feature-title">
          <img src="../assets/images/index/KeyFeatures.png" style="max-width: 296px" />
        </h2>
        <div class="bottom">
          <div class="card">
            <img src="../assets/images/index/nft.png" alt="" />
            <div class="title">{{ $t('official.index.keyFeatureCard[0].title') }}</div>
            <div class="desc">
              {{ $t('official.index.keyFeatureCard[0].desc') }}
            </div>
          </div>
          <div class="card">
            <img src="../assets/images/index/multi.png" alt="" />
            <div class="title">{{ $t('official.index.keyFeatureCard[1].title') }}</div>
            <div class="desc">
              {{ $t('official.index.keyFeatureCard[1].desc') }}
            </div>
          </div>
          <div class="card">
            <img src="../assets/images/index/batch.png" alt="" />
            <div class="title">{{ $t('official.index.keyFeatureCard[2].title') }}</div>
            <div class="desc">
              {{ $t('official.index.keyFeatureCard[2].desc') }}
            </div>
          </div>
        </div>
      </div>
      <!-- Roadmap -->
      <div class="roadmap">
        <img src="../assets/images/index/c1.png" alt="" class="c1" />
        <img src="../assets/images/index/c3.png" alt="" class="c3" />
        <h2>{{ $t('official.index.roadMap.title') }}</h2>

        <div class="r-container">
          <img
            src="../assets/images/index/roadmap-arrow.png"
            class="roadmap-arrow"
            @click="roadmapRight"
          />
          <img
            src="../assets/images/index/roadmap-arrow.png"
            class="roadmap-arrow right"
            @click="roadmapLeft"
          />
          <div class="r-wrapper-box">
            <div
              class="r-wrapper"
              :style="{ width: `${8 * 210 + 290 + 200}px` }"
              ref="roadmapWrapper"
            >
              <div class="r-item" :class="{ bottom: n % 2 == 0 }" v-for="n in 9" :key="n">
                <div class="panel">
                  <p class="r-title">Sep. 2021</p>
                  <p class="r-content">Launch with Starcoin testnet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Security -->
      <div class="security">
        <img src="../assets/images/index/security-banner.png" class="security-banner" />
        <div class="right-part">
          <h1><img src="../assets/images/index/Security.png" style="max-width: 185px" /></h1>
          <div class="market-desc">
            {{ $t('official.index.securityDesc') }}
          </div>
          <div class="btn protocal">
            <a href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-faq" target="_blank">
              {{ $t('official.btn.protocalSecurity') }}
            </a>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer>
        <div class="links">
          <h3>{{ $t('official.footer.legal') }}</h3>
          <a class="link" target="_blank" href="https://b-fly.gitbook.io/bfly-legal/">
            {{ $t('official.footer.privacy') }}
          </a>
          <a class="link" target="_blank" href="https://b-fly.gitbook.io/bfly-legal/">
            {{ $t('official.footer.terms') }}
          </a>
          <a class="link" target="_blank" href="mailto:info@wormhole.studio">
            {{ $t('official.footer.concact') }}
          </a>
        </div>
        <div class="links">
          <h3>{{ $t('official.footer.resource') }}</h3>
          <a class="link" target="_blank" href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-faq">
            {{ $t('official.footer.faq') }}
          </a>
          <a class="link" target="_blank" href="https://www.starcoin.org">
            {{ $t('official.footer.stc-homepage') }}
          </a>
        </div>
        <div class="links">
          <h3>{{ $t('official.footer.connect') }}</h3>
          <div class="media">
            <a class="link" target="_blank" href="https://t.me/bflyfinance">
              <img src="../assets/images/icon/telegram.png" />
              Telegram
            </a>
            <a class="link" target="_blank" href="https://twitter.com/BflyFinance">
              <img src="../assets/images/icon/twitter.png" />
              Twitter
            </a>
            <a class="link" target="_blank" href="https://github.com/WormholeStudio">
              <img src="../assets/images/icon/github.png" />
              Github
            </a>
            <a class="link" target="_blank" href="https://bfly-72615.medium.com/">
              <img src="../assets/images/icon/medium.png" />
              Medium
            </a>
            <a class="link" target="_blank" href="https://discord.gg/WjNK9K6vTG">
              <img src="../assets/images/icon/discord.png" />
              Discord
            </a>
          </div>
        </div>
        <locale-switch class="footer-local-switch"></locale-switch>
      </footer>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { ENUMS } from 'config';
  import { useRouter } from 'vue-router';
  import anime from 'animejs/lib/anime.es.js';
  import useToken from 'uses/useToken';

  import LocaleSwitch from 'comp/LocaleSwitch.vue';

  const { ROUTE_NAME } = ENUMS;
  const { getHomeAPY } = useToken();
  const router = useRouter();
  const roadmapWrapper = ref('');
  const apys = ref({});
  const wrapperLeft = ref(0);

  let wrapperStepper = 240;
  let wrapperLeftMax = 0;

  onMounted(async () => {
    wrapperLeftMax =
      -1 *
      (document.querySelector('.r-wrapper').getBoundingClientRect().width -
        document.querySelector('.r-container').getBoundingClientRect().width);
    wrapperStepper = Math.ceil(
      document.querySelector('.r-wrapper').getBoundingClientRect().width / 9,
    );

    apys.value = await getHomeAPY();
  });

  const roadmapLeft = () => {
    if (wrapperLeftMax == 0) return;

    wrapperLeft.value -= wrapperStepper;
    if (wrapperLeft.value < wrapperLeftMax) {
      wrapperLeft.value = wrapperLeftMax;
    }

    anime({
      targets: '.r-wrapper',
      translateX: `${wrapperLeft.value}px`,
      duration: 400,
      easing: 'linear',
    });
  };

  const roadmapRight = () => {
    if (wrapperLeftMax == 0) return;

    wrapperLeft.value += wrapperStepper;
    if (wrapperLeft.value > 0) {
      wrapperLeft.value = 0;
    }

    anime({
      targets: '.r-wrapper',
      translateX: `${wrapperLeft.value}px`,
      duration: 400,
      easing: 'linear',
    });
  };
</script>

<style lang="less" scoped>
  .home {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0 0;
    background: linear-gradient(179deg, #00053c 0%, #010101 100%);
    font-family: PingFang SC;

    a {
      color: white;
    }

    .container {
      width: 100%;
      max-width: 1440px;
      background: url(../assets/images/index/index-top-bg.png) right 220px no-repeat;

      header {
        width: 100%;
        height: 120px;
        // background: rgba(#000000, 0.4);
        // box-shadow: 0px 0px 18px 3px rgba(255, 255, 255, 0.03);
        // border-radius: 16px;
        padding: 25px 60px;
        font-size: 22px;
        color: white;
        display: flex;
        align-items: center;

        .header-local-switch {
          display: none;
        }

        .menu {
          display: flex;
          align-items: center;
          margin-left: auto;
          font-weight: 300;

          .btn {
            width: 123px;
            height: 40px;
            background: #0242a4;
            border-radius: 7px;
            font-weight: 400;
          }

          .menu-item {
            margin: 0 30px;
            cursor: pointer;
            user-select: none;

            font-size: 16px;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      .c2 {
        position: absolute;
        top: 1310px;
        right: 50%;
        margin-right: -780px;
        display: none;
      }

      .banner {
        width: 100%;
        padding: 210px 80px;
        color: #fdfdfd;

        .title {
          font-size: 70px;
          font-weight: 800;
          line-height: 84px;
          text-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
          margin-bottom: 40px;

          img {
            max-width: 498px;
          }
        }

        .desc {
          max-width: 610px;
          font-size: 24px;
          font-weight: 300;
          color: #fdfdfd;
          line-height: 40px;
          margin-bottom: 50px;
        }
      }

      .money-market {
        width: 100%;
        height: 1390px;
        background: rgba(26, 27, 28, 0.95);
        box-shadow: 0px 0px 18px 3px rgba(0, 0, 0, 0.03);
        padding: 100px 60px 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;

        .top,
        .bottom {
          width: 100%;
          display: flex;
        }

        .top {
          margin-bottom: 90px;

          .coin-list {
            display: flex;
            flex-direction: column;
            align-items: center;

            .coin-list-item {
              width: 550px;
              height: 100px;
              background: #252837;
              box-shadow: 0px 0px 18px 3px rgba(0, 0, 0, 0.05);
              border-radius: 16px;
              padding: 25px;
              color: #999999;
              display: flex;
              font-size: 16px;
              margin-bottom: 50px;
              align-items: center;
              cursor: pointer;

              .token-icon {
                width: 50px;
                height: 50px;
                flex-shrink: 0;
                margin-right: 20px;
              }

              .name {
                h2 {
                  color: white;
                  font-size: 26px;
                  font-weight: 600;
                  line-height: 37px;
                  margin: 0;
                }
              }

              .apy {
                margin-left: auto;
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .value {
                  font-size: 24px;
                  font-weight: 600;
                  color: #59aa83;
                  line-height: 33px;
                }
              }
            }

            .view-more {
              width: 127px;
              height: 43px;
              border: 1px solid #ffffff;
              font-size: 16px;
              font-weight: 400;
              color: #ffffff;
            }
          }
        }

        .feature-title {
          font-size: 48px;
          font-weight: 600;
          color: #ffffff;
          line-height: 67px;
          margin-bottom: 70px;
        }

        .bottom {
          display: flex;
          justify-content: space-between;

          .card {
            max-width: 380px;
            width: 31%;
            height: 360px;
            background: linear-gradient(136deg, #2d3143 0%, #1c1e2a 100%);
            box-shadow: 0px 4px 8px 6px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            padding: 35px 20px;
            font-size: 18px;
            font-weight: 400;
            color: #d5d5d5;
            line-height: 25px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .title {
              font-size: 24px;
              font-weight: 600;
              color: #d5d5d5;
              line-height: 33px;
              margin-bottom: 20px;
            }

            .desc {
              word-break: break-word;
              opacity: 0.8;
            }
          }
        }
      }

      .roadmap {
        width: 100%;
        // height: 590px;
        background: linear-gradient(180deg, #02131f 0%, #000631 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 75px 80px;
        position: relative;

        .c1 {
          position: absolute;
          top: -20px;
          left: 165px;
          z-index: 1;
        }

        .c3 {
          position: absolute;
          bottom: -73px;
          right: 235px;
          z-index: 1;
        }

        h2 {
          height: 67px;
          font-size: 48px;
          font-weight: 600;
          color: #ffffff;
          line-height: 67px;
        }

        .r-container {
          width: 100%;
          max-width: 1200px;
          position: relative;
          margin-top: 50px;

          padding: 0 30px;

          .roadmap-arrow {
            position: absolute;
            top: 107px;
            left: 0;
            cursor: pointer;

            &.right {
              left: initial;
              right: 0;
              transform: rotate(180deg);
            }
          }

          .r-wrapper-box {
            overflow-x: scroll;
            position: relative;
            &::before {
              content: '';
              width: 100%;
              height: 8px;
              top: 50%;
              margin-top: -4px;
              display: block;
              position: absolute;
              background: #ce4166;
            }
            &::-webkit-scrollbar {
              display: none;
            }
          }

          .r-wrapper {
            min-width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 100px;

            .r-item {
              width: 290px;
              height: 240px;
              position: relative;
              margin-left: -80px;
              flex-shrink: 0;

              &:first-child {
                margin-left: 0;
              }

              &:before {
                content: '';
                display: block;
                width: 30px;
                height: 30px;
                background: #f5f5f5;
                box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
                position: absolute;
                top: 50%;
                left: 50%;
                border-radius: 50%;
                margin-top: -15px;
                margin-left: -15px;
              }

              .panel {
                background: linear-gradient(136deg, #2d3143 0%, #1c1e2a 100%);
                box-shadow: 0px 4px 8px 6px rgba(0, 0, 0, 0.1);
                padding: 10px;
                min-height: 80px;
                position: absolute;
                width: 100%;

                &:after {
                  content: '';
                  display: block;
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-top-color: #646467;
                  position: absolute;
                  left: 50%;
                  bottom: -20px;
                  margin-left: -10px;
                }

                p {
                  margin-bottom: 0;
                }

                .r-title {
                  font-size: 21px;
                  font-weight: 600;
                  color: #ffffff;
                  line-height: 29px;
                }

                .r-content {
                  font-size: 18px;
                  font-weight: 400;
                  color: #ffffff;
                  line-height: 25px;
                }
              }

              &.bottom {
                .panel {
                  position: absolute;
                  bottom: 0;
                  top: initial;

                  &:after {
                    content: '';
                    display: block;
                    width: 0;
                    height: 0;
                    border: 10px solid transparent;
                    border-bottom-color: #646467;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    margin-left: -10px;
                    margin-top: -20px;
                  }
                }
              }
            }
          }
        }
      }

      .security {
        width: 100%;
        min-height: 725px;
        background: #050324;
        padding: 125px 120px;
        display: flex;
        align-items: flex-start;

        .security-banner {
          width: 595px;
        }

        .right-part {
          margin-left: 70px;
        }
      }

      footer {
        padding: 60px 0;
        position: relative;
        display: flex;
        justify-content: center;
        color: white;
        gap: 140px;

        .footer-local-switch {
          display: block;
        }

        .links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          h3 {
            color: white;
            font-size: 21px;
            font-weight: 600;
            color: #ffffff;
            line-height: 29px;
            margin-bottom: 30px;
          }

          .link {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 22px;
            margin-bottom: 20px;
            color: #a3a3a3;
          }

          .media {
            display: flex;
            flex-wrap: wrap;
            width: 330px;
            gap: 25px;
          }
        }
      }

      .right-part {
        width: 100%;
        margin-left: 100px;

        h1 {
          font-size: 88px;
          font-weight: bolder;
          color: white;
          line-height: 1;
        }

        .market-desc {
          font-size: 24px;
          font-weight: 400;
          color: #ffffff;
          line-height: 40px;
          opacity: 0.8;
          margin-bottom: 120px;
        }
      }
    }
  }

  .btn {
    &.protocal {
      width: 150px;
      height: 50px;
      background: linear-gradient(90deg, #0577d1 0%, #0242a4 100%);
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
    }
  }

  @media screen and (max-width: 749px) {
    .home {
      padding-top: 10px;

      .container {
        .c2 {
          display: none;
        }

        header {
          width: 90%;
          margin: 0 auto;
          padding: 10px 20px;

          .header-local-switch {
            display: block;
          }

          .menu {
            .menu-item {
              display: none;

              &:nth-last-child(2) {
                display: flex;
                width: auto;
                padding: 0 20px;
              }
            }
          }
        }

        .banner {
          width: 90%;
          margin: 0 auto;
          padding: 50px 0 130px;

          .title {
            img {
              width: 100%;
            }
          }

          .desc {
            width: 100%;
          }
        }

        .money-market {
          min-height: 1390px;
          height: auto;
          margin: 0 auto;
          padding: 20px;
          width: 90%;

          .top {
            flex-direction: column;

            .coin-list {
              width: 100%;

              .coin-list-item {
                width: 100%;
                margin-bottom: 10px;
              }

              .view-more {
                margin-top: 20px;
              }
            }
          }
          .bottom {
            flex-direction: column;

            .card {
              width: 100%;
              max-width: none;
              height: auto;
              min-height: 360px;
              margin-bottom: 20px;
            }
          }
        }

        .roadmap {
          width: 90%;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;

          .c1 {
            top: -30px;
            left: 215px;
            width: 65px;
          }
        }

        .security {
          min-height: 725px;
          height: auto;
          flex-direction: column;
          padding: 125px 20px;
          width: 90%;
          margin: 0 auto;
          align-items: center;

          .security-banner {
            width: 100%;
            max-width: 595px;
          }

          .right-part {
            margin-left: 0;
          }
        }

        .right-part {
          margin-top: 50px;
          margin-left: 0;
          padding: 0;

          h1 {
            img {
              width: 100%;
            }
          }
        }

        footer {
          width: 90%;
          margin: 0 auto;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 60px 20px;
          gap: 20px;

          .footer-local-switch {
            display: none;
          }

          .links {
            .media {
              width: 100%;
              max-width: 330px;
            }
          }
        }
      }
    }
  }
</style>
