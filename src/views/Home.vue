<template>
  <div class="home">
    <div class="container">
      <img src="../assets/images/index/c2.png" alt="" class="c2" />

      <!-- Header -->
      <header>
        <div class="logo">BFLY.FINANCE</div>
        <div class="menu">
          <span class="menu-item">Market</span>
          <span class="menu-item">
            <a href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-whitepaper" target="_blank">
              Docs
            </a>
          </span>
          <span class="menu-item">Governance</span>
          <span class="menu-item">
            <a href="https://b-fly.gitbook.io/b-fly/protocol-security" target="_blank">Security</a>
          </span>
          <div class="btn menu-item">
            <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">APP</router-link>
          </div>
        </div>
      </header>
      <!-- Banner -->
      <div class="banner">
        <div class="title">B-FLY Protocol</div>
        <div class="desc">
          Borrow, earn and build on the very first lending protocol on Starcoin Chain.
        </div>

        <div class="btn protocal">
          <a
            href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-whitepaper#the-b-fly-protocol"
            target="_blank"
          >
            Protocol Docs
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
                <span class="value">2.66%</span>
                <span>APY</span>
              </div>
            </div>
            <!-- ETH -->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'ETH' } })"
            >
              <img src="../assets/images/coin/meth.png" class="token-icon" />
              <div class="name">
                <h2>Ether</h2>
                <span>ETH</span>
              </div>
              <div class="apy">
                <span class="value">2.66%</span>
                <span>APY</span>
              </div>
            </div>
            <!-- BTC-->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'BTC' } })"
            >
              <img src="../assets/images/coin/mbtc.png" class="token-icon" />
              <div class="name">
                <h2>Bitcoin</h2>
                <span>BTC</span>
              </div>
              <div class="apy">
                <span class="value">2.66%</span>
                <span>APY</span>
              </div>
            </div>
            <!-- USDT -->
            <div
              class="coin-list-item"
              @click="router.push({ name: ROUTE_NAME.BORROWHOME.value, query: { token: 'USDT' } })"
            >
              <img src="../assets/images/coin/musdt.png" class="token-icon" />
              <div class="name">
                <h2>Tether</h2>
                <span>USDT</span>
              </div>
              <div class="apy">
                <span class="value">2.66%</span>
                <span>APY</span>
              </div>
            </div>
            <div class="btn view-more">
              <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">View More</router-link>
            </div>
          </div>
          <div class="right-part">
            <h1>Money Markets</h1>
            <div class="market-desc">
              A Decentralized Market to deposit and borrow assets whilst earning interest. With
              B-Fly protocol, you can not only use fungible tokens as collateral, but also
              Non-Fungible Tokens(NFTs).
            </div>
            <div class="btn protocal">
              <router-link :to="{ name: ROUTE_NAME.BORROWHOME.value }">Launch App</router-link>
            </div>
          </div>
        </div>
        <h2 class="feature-title">Key Features</h2>
        <div class="bottom">
          <div class="card">
            <img src="../assets/images/index/nft.png" alt="" />
            <div class="title">NFT + DeFi</div>
            <div class="desc">
              A single deployed contract on B-Fly protocol can include any combination of fungible
              tokens, non-fungible tokens or other configuration.
            </div>
          </div>
          <div class="card">
            <img src="../assets/images/index/multi.png" alt="" />
            <div class="title">Multi-Chain Operability</div>
            <div class="desc">
              With B-Fly protocol, you can borrow and lend across most blockchains with ease.
            </div>
          </div>
          <div class="card">
            <img src="../assets/images/index/batch.png" alt="" />
            <div class="title">Batch Transfer</div>
            <div class="desc">
              With B-Fly protocol, you can transfer your assets and debts together, saving up to 90%
              gas fee.
            </div>
          </div>
        </div>
      </div>
      <!-- Roadmap -->
      <div class="roadmap">
        <img src="../assets/images/index/c1.png" alt="" class="c1" />
        <img src="../assets/images/index/c3.png" alt="" class="c3" />
        <h2>Roadmap</h2>
      </div>
      <!-- Security -->
      <div class="security">
        <img src="../assets/images/index/security-banner.png" class="security-banner" />
        <div class="right-part">
          <h1>Security</h1>
          <div class="market-desc">
            The B-Fly protocol is one of the most secure DeFi project in the crypto world. With
            innate nature of “move” language, the protocol is more robust in preventing certain
            attacks.
          </div>
          <div class="btn protocal">
            <a href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-faq" target="_blank">
              Protocol Security
            </a>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer>
        <div class="links">
          <h3>Legal</h3>
          <a class="link" target="_blank" href="">Privacy</a>
          <a class="link" target="_blank" href="">Terms</a>
          <a class="link" target="_blank" href="">Contact</a>
        </div>
        <div class="links">
          <h3>Resource</h3>
          <a class="link" target="_blank" href="https://b-fly.gitbook.io/b-fly/b-fly-protocol-faq">
            FAQ
          </a>
          <a class="link" target="_blank" href="www.starcoin.org">STC Homepage</a>
        </div>
        <div class="links">
          <h3>Connect</h3>
          <div class="media">
            <a class="link" target="_blank" href="https://t.me/bflyfinance">
              <img src="../assets/images/icon/telegram.png" />
              Telegram
            </a>
            <a class="link" target="_blank" href="">
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
      </footer>
    </div>
  </div>
</template>

<script setup>
  import { ENUMS } from 'config';
  import { useRouter } from 'vue-router';

  const { ROUTE_NAME } = ENUMS;
  const router = useRouter();
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
    font-family: PingFangSC-Regular, PingFang SC;

    a {
      color: white;
    }

    .container {
      width: 100%;
      max-width: 1440px;
      background: url(../assets/images/index/index-top-bg.png) center 220px / contain no-repeat;

      header {
        width: 100%;
        height: 120px;
        background: rgba(#000000);
        // box-shadow: 0px 0px 18px 3px rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 25px 60px;
        font-size: 22px;
        color: white;
        display: flex;
        align-items: center;

        .menu {
          display: flex;
          align-items: center;
          margin-left: auto;

          .btn {
            width: 163px;
            height: 53px;
            background: #0242a4;
            border-radius: 7px;
          }

          .menu-item {
            margin: 0 30px;
            cursor: pointer;
            user-select: none;
            font-weight: bolder;

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
      }

      .banner {
        width: 100%;
        padding: 260px 60px 130px;
        color: #fdfdfd;

        .title {
          font-size: 70px;
          font-weight: 800;
          line-height: 84px;
          text-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5);
          margin-bottom: 40px;
        }

        .desc {
          font-size: 24px;
          font-weight: 400;
          line-height: 56px;
          width: 610px;
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
            padding: 35px 25px;
            font-size: 18px;
            font-weight: 400;
            color: #d5d5d5;
            line-height: 25px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            img {
              margin-top: -50px;
              margin-left: -25px;
            }

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
        height: 590px;
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
      }

      .security {
        width: 100%;
        height: 725px;
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
        justify-content: space-around;
        color: white;

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
      width: 225px;
      height: 69px;
      background: linear-gradient(90deg, #0577d1 0%, #0242a4 100%);
      border-radius: 8px;
      color: #ffffff;
      font-size: 24px;
    }
  }

  @media screen and (max-width: 1439px) {
    .home {
      .container {
        header {
          width: auto;
          margin: 0 20px;
          padding: 25px 30px;

          .menu {
            span {
              display: none;
            }
          }
        }

        .money-market {
          min-height: 1390px;
          height: auto;
          margin: 0 20px;
          width: auto;

          .top {
            flex-direction: column;

            .coin-list {
              width: 100%;

              .coin-list-item {
                width: 100%;
              }
            }
          }
          .bottom {
            flex-direction: column;

            .card {
              width: 100%;
              max-width: max-content;
              height: auto;
              min-height: 360px;
              margin-bottom: 20px;
            }
          }
        }

        .roadmap {
          width: auto;
          margin: 0 20px;

          .c1 {
            top: -60px;
          }
        }

        .security {
          min-height: 725px;
          height: auto;
          flex-direction: column;
          padding: 125px 60px;
          width: auto;
          margin: 0 20px;

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
        }
      }
    }
  }
</style>
