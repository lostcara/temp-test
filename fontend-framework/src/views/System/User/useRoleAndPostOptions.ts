import { onMounted, ref } from 'vue';

import { getRoleAndPostOptions } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';

const useRoleAndPostOptions = () => {
  const roleOptions = ref<any[]>([]);
  const postOptions = ref<any[]>([]);

  const getRoleData = async () => {
    const { code, msg, posts, roles }: any = await getRoleAndPostOptions();
    if (code === 200) {
      // 角色
      const roleList = roles.map((k: any) => ({
        ...k,
        label: k.roleName,
        value: k.roleId,
      }));
      roleOptions.value = roleList;
      // 岗位
      const postList = posts.map((k: any) => ({
        ...k,
        label: k.postName,
        value: k.postId,
      }));
      postOptions.value = postList;
    } else {
      messageWithKey.error(msg);
    }
  };

  onMounted(() => {
    getRoleData();
  });

  return {
    postOptions,
    roleOptions,
  };
};

export default useRoleAndPostOptions;
