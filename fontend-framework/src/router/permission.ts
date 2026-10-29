import type { Router } from 'vue-router';

import { STORAGE_TOKEN, WHITE_ROUTER_LIST } from '/@/utils/consts';
import Storage from '/@/utils/Storage';

// 路由白名单
const whiteList = WHITE_ROUTER_LIST;

export const routerWithPermissions = (router: Router) => {
  // 路由导航守卫
  router.beforeEach(async (to) => {
    // 判断 token 是否存在
    if (Storage.getCookie(STORAGE_TOKEN)) {
      // 判断路径是否为 '/login'
      return to.path === '/login' ? { path: '/' } : true;
    } else {
      // 在免登录白名单，直接进入 配置 (whiteList)
      // 不需要 token 的
      return whiteList.includes(to.path) ? true : { path: '/login' };
    }
  });
};
