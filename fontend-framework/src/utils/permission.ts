import useUserStore from '/@/store/modules/user';
import { PERMISSIONS_CHAR_ADMIN, PERMISSIONS_ROLE_ADMIN } from '/@/utils/consts';

/**
 * 字符权限校验
 * @param value string[]
 * @returns boolean
 */
export const checkPermission = (value: string[]) => {
  if (value && value instanceof Array && value.length > 0) {
    const userStore = useUserStore();
    const permissions = userStore.permissions;
    const permissionDatas = value;
    const all_permission = PERMISSIONS_CHAR_ADMIN;

    const hasPermission = permissions.some((permission) => {
      return all_permission === permission || permissionDatas.includes(permission);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    return false;
  }
};

/**
 * 角色权限校验
 * @param value string[]
 * @returns boolean
 */
export const checkRole = (value: string[]) => {
  if (value && value instanceof Array && value.length > 0) {
    const userStore = useUserStore();
    const roles = userStore.roles;
    const permissionRoles = value;
    const super_admin = PERMISSIONS_ROLE_ADMIN;

    const hasRole = roles.some((role) => {
      return super_admin === role || permissionRoles.includes(role);
    });

    if (!hasRole) {
      return false;
    }
    return true;
  } else {
    return false;
  }
};