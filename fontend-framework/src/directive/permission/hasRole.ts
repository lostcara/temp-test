import { PERMISSIONS_ROLE_ADMIN } from '/@/utils/consts';
import useUserStore from '/@/store/modules/user';

/**
 * v-hasRole 角色权限处理
 */
const hasRole = {
  mounted(el: any, binding: any) {
    const { value } = binding;
    const super_admin = PERMISSIONS_ROLE_ADMIN;
    const userStore = useUserStore();
    const roles = userStore.roles;

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value;

      const hasRole = roles.some((role) => {
        return super_admin === role || roleFlag.includes(role);
      });

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置角色权限标签值`);
    }
  },
};

export default hasRole;
