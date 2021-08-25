import { createRouter, createWebHashHistory } from 'vue-router';
import { ENUMS } from 'config';

const { ROUTE_NAME } = ENUMS;

const routes = [
  {
    path: '',
    component: () => import(/* webpackChunkName: "main-layout" */ 'layout/Main.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ 'views/Home.vue'),
      },
      {
        path: 'market',
        name: 'Market',
        component: () => import(/* webpackChunkName: "market" */ 'views/Market.vue'),
      },
      {
        path: 'governance',
        name: 'Governance',
        component: () => import(/* webpackChunkName: "governance" */ 'views/Governance.vue'),
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import(/* webpackChunkName: "community" */ 'views/Community.vue'),
      },
    ],
  },
  {
    path: '/borrow',
    component: () => import(/* webpackChunkName: "borrow" */ 'layout/Borrow.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAME.BORROWHOME.value,
        component: () => import(/* webpackChunkName: "borrow-home" */ 'views/Borrow/Home.vue'),
      },
      {
        path: 'resource',
        name: ROUTE_NAME.BORROWRESOURCE.value,
        component: () =>
          import(/* webpackChunkName: "borrow-resource" */ 'views/Borrow/Resource.vue'),
      },
      {
        path: 'deposit',
        name: ROUTE_NAME.BORROWDEPOSIT.value,
        component: () =>
          import(/* webpackChunkName: "borrow-deposit" */ 'views/Borrow/Deposit.vue'),
      },
      {
        path: 'loan',
        name: ROUTE_NAME.BORROWLOAN.value,
        component: () => import(/* webpackChunkName: "borrow-loan" */ 'views/Borrow/Loan.vue'),
      },
      {
        path: 'history',
        name: ROUTE_NAME.BORROWHISTORY.value,
        component: () =>
          import(/* webpackChunkName: "borrow-history" */ 'views/Borrow/History.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Home' },
  },
];

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
