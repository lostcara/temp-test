import { ref, onMounted } from 'vue';
import { getRoleList } from '/@/api/user';
import { OPTION_ALL } from '/@/utils/consts';

const useRoleOptions = () => {
  const roleOptions = ref<any[]>([]);
  const roleAllOptions = ref<any[]>([]);

  const getRoleData = async () => {
    const { code, data }: any = await getRoleList();
    if (code === 200) {
      const list = data.map((item: any) => ({
        label: item.roleName,
        value: item.roleId,
        roleId: item.roleId,
        roleName: item.roleName,
      }));
      roleOptions.value = list;
      roleAllOptions.value = [OPTION_ALL, ...list];
    }
  };

  onMounted(() => {
    getRoleData();
  });

  return {
    roleOptions,
    roleAllOptions,
  };
};

export default useRoleOptions;
