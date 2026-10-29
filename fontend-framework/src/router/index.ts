import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LayOuts from '/@/layouts/index.vue';
import { routerWithPermissions } from './permission';
import { commonRouters } from './common';
import { constRoutes, publicRoutes } from './const';
import { MENU_ROUTER_NAME } from '/@/utils/consts';
import { markRaw } from 'vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: MENU_ROUTER_NAME,
    redirect: '/home',
    meta: {
      title: '首页',
    },
    component: markRaw(LayOuts),
    children: [...constRoutes, ...publicRoutes],
  },
  ...commonRouters,
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
  // /About  /about  -->  /about  不区分大小写
  strict: true,
});

// 路由导航守卫（添加权限逻辑）
routerWithPermissions(router);

export default router;
