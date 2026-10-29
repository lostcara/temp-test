import { onMounted, ref } from 'vue';

import { getDeptTreeOptions } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';

const useDeptTreeOptions = () => {
  const deptTreeOptions = ref<any[]>();

  const initDeptTree = async () => {
    const { code, data, msg }: any = await getDeptTreeOptions();
    if (code === 200) {
      deptTreeOptions.value = data;
    } else {
      messageWithKey.error(msg);
    }
  };

  onMounted(() => {
    initDeptTree();
  });

  return {
    deptTreeOptions,
  };
};

export default useDeptTreeOptions;
