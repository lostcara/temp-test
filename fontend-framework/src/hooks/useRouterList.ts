import type { RouteRecordRaw } from 'vue-router';
import { routersApi } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';
import useUserStore from '/@/store/modules/user';
import Storage from '/@/utils/Storage';
import { STORAGE_TOKEN } from '/@/utils/consts';
import { routerPermissions, mateRouteComponent } from '/@/utils/routeUtils';
import AliveRouteView from '/@/components/RouteContainer/AliveRouteView.vue';
import { markRaw } from 'vue';

export const useRouterList = () => {
  const userStore = useUserStore();

  const getRouterList = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      routersApi()
        .then(({ code, data, msg }: any) => {
          if (code !== 200) {
            messageWithKey.error(msg);
            Storage.removeCookie(STORAGE_TOKEN);
            userStore.resetUserInfo();
            reject();
          } else {
            resolve({ routerList: data });
          }
        })
        .catch(() => {
          reject();
        });
    });
  };

  // 产生重定向
  const createRedirect = (path: string, children: RouteRecordRaw[]) => {
    const childPath = children[0]?.path || '';
    if (path === '/') {
      return `/${childPath}`;
    }
    return `${path}/${childPath}`;
  };

  // 判断是否需要隐藏父级菜单
  const isEffective = (menuInfos: any[]) => {
    let flag = 0;
    menuInfos.forEach((k) => {
      if (k.meta?.hidden) {
        flag += 1;
      }
    });
    return flag === menuInfos.length;
  };

  const createMenuRouters = (routesOfMenus: any[], parRoute?: any): RouteRecordRaw[] => {
    const routerList: any = [];
    routesOfMenus.forEach((k: any) => {
      const routeName = parRoute && parRoute.name ? `${parRoute?.name}/${k.name}` : k.name;
      if (k.children && k.children.length > 0) {
        if (!isEffective(k.children)) {
          routerList.push({
            ...k,
            meta: {
              ...k.meta,
              hidden: k.hidden,
            },
            name: routeName,
            component: markRaw(AliveRouteView),
            redirect: createRedirect(k.path, k.children || []),
            children: createMenuRouters(k.children || [], {
              ...k,
              name: routeName,
            }),
          });
        }
      } else {
        routerList.push({
          ...k,
          meta: {
            ...k.meta,
            hidden: k.hidden,
          },
          component: mateRouteComponent(k.component, routerPermissions),
        });
      }
    });
    return routerList;
  };

  return {
    getRouterList,
    createMenuRouters,
  };
};
