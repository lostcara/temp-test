import { PERMISSIONS_CHAR_ADMIN } from '/@/utils/consts';
import useUserStore from '/@/store/modules/user';

/**
 * v-hasPermi 操作权限处理
 */
const hasPermi = {
  mounted(el: any, binding: any) {
    const { value } = binding;
    const all_permission = PERMISSIONS_CHAR_ADMIN;
    const userStore = useUserStore();
    const permissions = userStore.permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;

      const hasPermissions = permissions.some((permission) => {
        return all_permission === permission || permissionFlag.includes(permission);
      });

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};

export default hasPermi;
