import { createRouter, createWebHashHistory } from 'vue-router';
import { ENUMS } from 'config';

const { ROUTE_NAME } = ENUMS;

const routes = [
  {
    path: '',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ 'views/Home.vue'),
  },
  {
    path: '/app',
    name: ROUTE_NAME.BORROWHOME.value,
    component: () => import(/* webpackChunkName: "app-inner" */ 'views/Borrow/Home.vue'),
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
