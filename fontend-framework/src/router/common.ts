import { RouteRecordRaw } from 'vue-router';
import Login from '/@/views/System/Login/index.vue';
import NotFound from '/@/views/System/NotFound/index.vue';
import NoPermission from '/@/views/System/NoPermission/index.vue';
import { ROUTE_NAME_404, ROUTE_NAME_NO_PERMISSION } from '/@/utils/consts';

export const commonRouters: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  { path: '/nopermission', name: ROUTE_NAME_NO_PERMISSION, component: NoPermission },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: ROUTE_NAME_404, component: NotFound },
];
