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
        component: () => import(/* webpackChunkName: "home" */ 'views/Market.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
