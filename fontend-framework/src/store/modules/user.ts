import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserInfoType } from '/@/types/user';

const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfoType | any>();
  // 角色
  const roles = ref<string[]>([]);
  // 权限
  const permissions = ref<string[]>([]);
  // 头像
  const avatar = ref<string>('');

  const setUserInfo = (info: any) => {
    userInfo.value = info;
  };

  const setRoles = (roleList: string[]) => {
    roles.value = roleList;
  };

  const setPermissions = (permissionList: string[]) => {
    permissions.value = permissionList;
  };

  const setAvatar = (imgUrl: string) => {
    avatar.value = imgUrl;
  };

  // 重置用户信息
  const resetUserInfo = () => {
    userInfo.value = {};
    roles.value = [];
    permissions.value = [];
    avatar.value = '';
  };

  const clearUserInfo = (callBack?: () => void) => {
    resetUserInfo();
    if (callBack) {
      callBack();
    }
  };

  return {
    userInfo,
    setUserInfo,
    roles,
    setRoles,
    permissions,
    setPermissions,
    avatar,
    setAvatar,
    resetUserInfo,
    clearUserInfo,
  };
});

export default useUserStore;
