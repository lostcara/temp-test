import { ref, onMounted } from 'vue';
import { getRoleMenuTree } from '/@/api/role';

const useRoleMenuTree = () => {
  const menuTree = ref<any[]>([]);

  const cteateMenuTree: any = (menuList: [], parItem?: any) => {
    return menuList.map<any>((k: any) => ({
      key: k.id,
      label: k.label,
      parId: parItem && parItem.id ? k.parItem : '',
      children: k.children && k.children.length > 0 ? cteateMenuTree(k.children, k) : [],
    }));
  };

  const getData = async () => {
    const { code, data }: any = await getRoleMenuTree();
    if (code === 200) {
      menuTree.value = cteateMenuTree(data);
    }
  };

  onMounted(() => {
    getData();
  });

  return {
    menuTree,
  };
};

export default useRoleMenuTree;
