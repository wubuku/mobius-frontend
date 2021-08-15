import { createRouter, createWebHistory } from 'vue-router';

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
        name: 'BorrowHome',
        component: () => import(/* webpackChunkName: "borrow-home" */ 'views/Borrow/Home.vue'),
      },
      {
        path: 'resource',
        name: 'BorrowResource',
        component: () =>
          import(/* webpackChunkName: "borrow-resource" */ 'views/Borrow/Resource.vue'),
      },
      {
        path: 'deposit',
        name: 'BorrowDeposit',
        component: () =>
          import(/* webpackChunkName: "borrow-deposit" */ 'views/Borrow/Deposit.vue'),
      },
      {
        path: 'loan',
        name: 'BorrowLoan',
        component: () => import(/* webpackChunkName: "borrow-loan" */ 'views/Borrow/Loan.vue'),
      },
      {
        path: 'history',
        name: 'BorrowHistory',
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
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  next();
});

export default router;
