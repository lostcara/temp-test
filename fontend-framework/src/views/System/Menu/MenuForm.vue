<script setup lang="ts">
import { computed, createVNode, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Cascader,
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  RadioGroup,
  Segmented,
  Select,
} from 'ant-design-vue';
import iconList from 'virtual:svg-icons-names';

import {
  EXTERNAL_LINKS_NO,
  EXTERNAL_LINKS_OPTIONS,
  IS_CACHE_OPTIONS,
  IS_CACHE_YES,
  KEY_TOP_LEVEL_MENU,
  MENU_TYPE_BTN,
  MENU_TYPE_CATALOG,
  MENU_TYPE_MENU,
  MENU_TYPE_OPTIONS,
} from './const';

import { addMenu, updateMenu } from '/@/api/menu';
import { SvgIcon } from '/@/components/SvgIcon/index';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  displayRender,
  filter,
  filterOption,
  findAncestorKeysInTreeAry,
  flattenTree,
} from '/@/utils/common';
import { RULE_POSITIVE_INTEGER_NUMBER } from '/@/utils/rules';

interface FormState {
  component: string;
  icon: string | undefined;
  isCache?: string;
  isFrame?: string;
  menuId?: string;
  menuName: string;
  menuType: string;
  orderNum: number;
  parentId: string[] | undefined;
  path: string;
  perms: string;
  status: string;
  visible: string;
}

const props = defineProps({
  handleEffect: {
    default: () => {},
    type: Function,
  },
});

const { dictType } = useDictType(['sys_normal_disable', 'sys_show_hide']);

const iconOptions = iconList.map((k: string) => {
  const iconStr = k.split('icon-')?.[1];
  return {
    label: createVNode(SvgIcon, { name: iconStr }),
    value: iconStr,
  };
});

const useForm = Form.useForm;

const menuOptions = ref<any[]>([]);

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const visible = ref<boolean>(false);

const menuId = ref<string>('');

const status = ref<string>('add');

const title = computed(() =>
  status.value === 'add' ? '新增菜单' : '编辑菜单',
);

const isMenu = computed(() => formState.menuType === MENU_TYPE_MENU);

const isDirectory = computed(() => formState.menuType === MENU_TYPE_CATALOG);

const isButton = computed(() => formState.menuType === MENU_TYPE_BTN);

const formState: UnwrapRef<FormState> = reactive({
  component: '',
  icon: undefined,
  isCache: IS_CACHE_YES,
  isFrame: EXTERNAL_LINKS_NO,
  menuName: '',
  menuType: MENU_TYPE_CATALOG,
  orderNum: 1,
  parentId: undefined,
  path: '',
  perms: '',
  status: '0',
  visible: '0',
});

const rulesRef = reactive({
  component: [
    {
      message: '字符必须为字母和冒号!',
      pattern: /^\(?!\/\)[a-z][a-z/]*[a-z]$/i,
    },
  ],
  menuName: [
    { message: '请输入菜单名称!', required: true },
    { max: 12, message: '长度不得超过12个字符!' },
  ],
  orderNum: [
    { message: '请输入显示排序!', required: true },
    RULE_POSITIVE_INTEGER_NUMBER,
  ],
  path: [{ message: '请输入合理的路径', pattern: /^[a-z](\/[a-z]+)?/ }],
  perms: [
    {
      message: '字符必须为小写字母和冒号!',
      pattern: /^\(?!:\)[a-z][a-z:]*[a-z]$/,
    },
  ],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const showModal = (type: string, data: any, group: any[]) => {
  visible.value = true;
  status.value = type;
  menuOptions.value = [
    {
      label: '根目录',
      value: KEY_TOP_LEVEL_MENU,
      children: group,
    },
  ];
  if (type === 'edit') {
    Object.assign(formState, data);
    if (formState.menuId) {
      delete formState.menuId;
    }
    const flattenGroup = flattenTree(toRaw(menuOptions.value));
    formState.parentId = findAncestorKeysInTreeAry(
      flattenGroup,
      formState.parentId as any,
      'value',
      'parentId',
    ).reverse();
    menuId.value = data.menuId;
  } else {
    // 子级新增
    if (data) {
      const flattenGroup = flattenTree(toRaw(menuOptions.value));
      formState.parentId = findAncestorKeysInTreeAry(
        flattenGroup,
        data.parentId as any,
        'value',
        'parentId',
      ).reverse();
      // 将自己放入
      formState.parentId.push(data.menuId);
    }
  }
};

const resetFormState = () => {
  resetFields();
  menuId.value = '';
};

const handleOk = async () => {
  validate().then(async () => {
    const values: any = toRaw(formState);
    if (values.parentId) {
      values.parentId = values.parentId[values.parentId?.length - 1];
    }
    // values.status = '0';
    if (status.value === 'add') {
      const { code, msg }: any = await addMenu(values);
      if (code === 200) {
        messageWithKey.success(msg);
        visible.value = false;
        resetFormState();
        if (props.handleEffect) {
          props.handleEffect();
        }
      } else {
        messageWithKey.error(msg);
      }
    } else {
      values.menuId = menuId.value;
      const { code, msg }: any = await updateMenu(values);
      if (code === 200) {
        messageWithKey.success(msg);
        visible.value = false;
        resetFormState();
        if (props.handleEffect) {
          props.handleEffect();
        }
      } else {
        messageWithKey.error(msg);
      }
    }
  });
};

const cancel = () => {
  resetFormState();
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :title="title"
    :width="640"
    destroy-on-close
    @ok="handleOk"
    @cancel="cancel"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem label="菜单名称" v-bind="validateInfos.menuName">
        <Input
          v-model:value="formState.menuName"
          placeholder="请输入菜单名称"
        />
      </FormItem>
      <FormItem label="上级菜单" v-bind="validateInfos.parentId">
        <Cascader
          v-model:value="formState.parentId"
          :options="menuOptions"
          :display-render="displayRender"
          expand-trigger="hover"
          :show-search="{ filter }"
          change-on-select
          placeholder="请选择上级菜单"
        />
      </FormItem>
      <FormItem label="菜单类型" v-bind="validateInfos.menuType">
        <Segmented
          v-model:value="formState.menuType"
          block
          :options="MENU_TYPE_OPTIONS"
        >
          <template #label="{ label }">
            <div>{{ label }}</div>
          </template>
        </Segmented>
      </FormItem>
      <FormItem label="显示排序" v-bind="validateInfos.orderNum">
        <InputNumber v-model:value="formState.orderNum" :min="1" :step="1" />
      </FormItem>
      <FormItem
        v-if="isButton || isMenu"
        label="权限标识"
        v-bind="validateInfos.perms"
      >
        <Input v-model:value="formState.perms" placeholder="请输入权限标识" />
      </FormItem>
      <FormItem v-if="isDirectory" label="菜单图标" v-bind="validateInfos.icon">
        <Select
          v-model:value="formState.icon"
          :options="iconOptions"
          show-search
          allow-clear
          :filter-option="filterOption"
          placeholder="请选择菜单图标"
        >
          <template #option="{ value: val }">
            <SvgIcon v-if="val" :name="val" class="icon" />
            <span v-else>{{ val }}</span>
          </template>
        </Select>
        <!-- <Input v-model:value="formState.icon" /> -->
      </FormItem>
      <FormItem
        v-if="isDirectory || isMenu"
        label="路由地址"
        v-bind="validateInfos.path"
      >
        <Input v-model:value="formState.path" placeholder="请输入路由地址" />
      </FormItem>
      <FormItem v-if="isMenu" label="组件路径" v-bind="validateInfos.component">
        <Input
          v-model:value="formState.component"
          placeholder="请输入组件路径"
        />
      </FormItem>
      <FormItem v-if="isMenu" label="是否缓存" v-bind="validateInfos.isCache">
        <RadioGroup
          v-model:value="formState.isCache"
          :options="IS_CACHE_OPTIONS"
        />
      </FormItem>
      <FormItem
        v-if="isDirectory || isMenu"
        label="显示状态"
        v-bind="validateInfos.visible"
      >
        <RadioGroup
          v-model:value="formState.visible"
          :options="dictType.sys_show_hide"
        />
      </FormItem>
      <FormItem label="菜单状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_normal_disable"
        />
      </FormItem>
      <FormItem
        v-if="isDirectory || isMenu"
        label="是否外链"
        v-bind="validateInfos.isFrame"
      >
        <RadioGroup
          v-model:value="formState.isFrame"
          :options="EXTERNAL_LINKS_OPTIONS"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
