import { ref, onMounted } from 'vue';
import { getDictTypeChildren } from '/@/api/dict';
import { TAG_COLOR_OPTIONS } from '/@/utils/consts';
import { showOptionsOfAttr } from '/@/utils/common';

const useDictType = (typeData: string[]) => {
  const dictType = ref<any>({});

  const initDictType = (typeData: string[]) => {
    if (typeData && typeData.length > 0) {
      typeData.forEach(async (k) => {
        const { code, data }: any = await getDictTypeChildren(k);
        if (code === 200) {
          dictType.value[k] = data.map((v: any) => ({
            ...v,
            value: v.dictValue,
            label: v.dictLabel,
            color: showOptionsOfAttr(v.listClass, TAG_COLOR_OPTIONS, 'color'),
          }));
        }
      });
    }
  };

  onMounted(() => {
    initDictType(typeData);
  });

  return {
    dictType,
    initDictType,
  };
};

export default useDictType;
