<template>
  <div class="borrow-menu">
    <div class="b-menu">
      <div
        class="menu-item"
        :class="[name, { actived: BorrowRouteName(name) === route.name }]"
        v-for="name in routerMenus"
        :key="name"
        @click="toRouter(BorrowRouteName(name))"
      >
        {{ $t(`borrow.menus.${name}`) }}
      </div>
    </div>

    <div class="b-menu no-under">
      <div
        class="menu-item"
        :class="[name, { actived: BorrowRouteName(name) === route.name }]"
        v-for="name in bottomMenus"
        :key="name"
        @click="toOtherRouter(name)"
      >
        {{ $t(`borrow.menus.${name}`) }}
      </div>
    </div>
  </div>
</template>

<script>
  import { startCase } from 'lodash';
  import { defineComponent } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    props: {},
    setup() {
      const router = useRouter();
      const route = useRoute();
      const routerMenus = ['home', 'resource', 'deposit', 'loan', 'history'];
      const bottomMenus = ['governance', 'faq'];

      // Method
      const BorrowRouteName = (name) => `Borrow${startCase(name)}`;
      const toOtherRouter = (name) => {
        console.log(name);
      };
      const toRouter = (routerName) => {
        console.log(routerName);
        router.push({
          name: routerName,
        });
      };

      return {
        route,
        routerMenus,
        bottomMenus,
        BorrowRouteName,
        toOtherRouter,
        toRouter,
      };
    },
  });
</script>

<style lang="less" scoped>
  .borrow-menu {
    width: 100%;

    .b-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 35px;
      padding-bottom: 25px;
      border-bottom: 1px solid #6ecee5;

      &.no-under {
        border: none;
      }
    }

    .menu-item {
      background-color: transparent;
      color: white;
      font-size: 14px;
      border: none;
      width: 180px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      display: flex;
      align-items: center;
      padding-left: 15px;
      margin-bottom: 5px;
      cursor: pointer;

      @icons: home, resource, deposit, loan, history, governance, faq;
      each(@icons, {
          &.@{value} {
            
            &:before {
              width: 15px;
              height: 15px;
              content: '';
              margin-right: 10px;
              background: url('../../assets/images/borrow/icon/@{value}.png') 0 0 / contain no-repeat;
            }

            &:hover,
            &.actived {
              &:before {
                 background: url('../../assets/images/borrow/icon/@{value}-active.png') 0 0 / contain no-repeat;
              }
            }
          }
        }
      );

      &:hover,
      &.actived {
        background-color: #fff;
        border-radius: 22.5px;
        color: #51afc6;
      }
    }
  }
</style>
