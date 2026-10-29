import { defineStore } from 'pinia';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { routes as BasicRoutes } from '/@/router';
import { MENU_ROUTER_NAME } from '/@/utils/consts';
import { publicRoutes } from '/@/router/const';

const useRouteStore = defineStore('route', () => {
  const routes = ref<RouteRecordRaw[]>([...BasicRoutes]);

  // 更新从后端获取的路由数据（修改LayOut的children,并更新重定向）
  const updateRoutes = (LayoutChildren: any[]) => {
    routes.value = routes.value.map((k: RouteRecordRaw) => {
      if (k.name === MENU_ROUTER_NAME) {
        return {
          ...k,
          redirect: LayoutChildren[0].path,
          children: [...LayoutChildren, ...publicRoutes],
        };
      }
      return k;
    });
    return routes.value;
  };

  return {
    routes,
    updateRoutes,
  };
});

export default useRouteStore;
