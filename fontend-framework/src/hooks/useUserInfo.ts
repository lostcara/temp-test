import { userInfoApi } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';
import Storage from '/@/utils/Storage';
import { STORAGE_TOKEN } from '/@/utils/consts';
import useUserStore from '/@/store/modules/user';
import { isNotEmpty } from '/@/utils/common';

export const useUserInfo = () => {
  const userStore = useUserStore();

  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      userInfoApi()
        .then(({ code, msg, permissions, roles, user }: any) => {
          if (code !== 200) {
            // 获取用户信息失败
            // 1.清空token
            // 2.清空用户信息
            // 2.退至登录页面
            messageWithKey.error(msg);
            Storage.removeCookie(STORAGE_TOKEN);
            userStore.resetUserInfo();
            reject();
          } else {
            // 添加菜单权限
            if (isNotEmpty(permissions)) {
              userStore.setPermissions(permissions);
            }
            // 添加角色
            if (isNotEmpty(roles)) {
              userStore.setRoles(roles);
            }
            // 添加用户信息
            if (isNotEmpty(user)) {
              userStore.setUserInfo(user);
            }
            resolve({ code });
          }
        })
        .catch(() => {
          reject();
        });
      // const { code, msg, permissions, roles, user } = await userInfoApi();
      // if (code !== 200) {
      //   // 获取用户信息失败
      //   // 1.清空token
      //   // 2.退至登录页面
      //   messageWithKey.error(msg);
      //   Storage.removeCookie(STORAGE_TOKEN);
      //   if (reject) {
      //     reject();
      //   }
      // } else {
      //   // 添加菜单权限
      //   if (isNotEmpty(permissions)) {
      //     userStore.setPermissions(permissions);
      //   }
      //   // 添加角色
      //   if (isNotEmpty(roles)) {
      //     userStore.setRoles(roles);
      //   }
      //   // 添加用户信息
      //   if (isNotEmpty(user)) {
      //     userStore.setUserInfo(user);
      //   }
      //   if (resolve) {
      //     resolve();
      //   }
      // }
    });
  };

  return {
    getUserInfo,
  };
};
