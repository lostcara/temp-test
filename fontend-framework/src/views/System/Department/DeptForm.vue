<script setup lang="ts" name="DeptForm">
import type { PropType } from 'vue';

import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  RadioGroup,
  TreeSelect,
} from 'ant-design-vue';
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';

import { addDeptData, editDeptData, getDeptDataItem } from '/@/api/dept';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';

interface FormState {
  deptId?: string;
  deptName: string;
  email: string;
  leader: string;
  orderNum: number;
  parentId: any;
  phone: string;
  status: string;
}

const props = defineProps({
  deptTreeOptions: {
    required: true,
    type: Array as PropType<DefaultOptionType[]>,
  },
  handleEffect: {
    default: () => {},
    type: Function,
  },
});

const useForm = Form.useForm;

const visible = ref<boolean>(false);
const deptId = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_normal_disable']);

const formState: UnwrapRef<FormState> = reactive({
  deptName: '',
  email: '',
  leader: '',
  orderNum: 0,
  parentId: null,
  phone: '',
  status: '0',
});

const rulesRef = reactive({
  deptName: [
    { message: '请输入部门名称!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  orderNum: [{ message: '请输入显示排序!', required: true }],
  parentId: [{ message: '请选择上级部门!', required: true }],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增部门' : '编辑部门';
});

const showDisabled = (parentId: string) => {
  return String(parentId) === '0';
};

const handleCancel = () => {
  deptId.value = '';
  formState.status = '0';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getDeptDataItem(record.deptId);
    if (code === 200) {
      deptId.value = record.deptId;
      visible.value = true;
      formState.deptName = data.deptName;
      formState.parentId = data.parentId;
      formState.orderNum = data.orderNum;
      formState.phone = data.phone;
      formState.email = data.email;
      formState.leader = data.leader;
      formState.status = data.status;
    } else {
      messageWithKey.error(msg);
    }
  } else {
    if (record) {
      formState.parentId = record.deptId;
    }
    visible.value = true;
  }
};

const handleOk = async () => {
  validate()
    .then(() => {
      onSubmit();
    })
    .catch(() => {});
};

const onSubmit = async () => {
  const values = toRaw(formState);
  if (status.value === 'add') {
    const { code, msg }: any = await addDeptData(values);
    if (code === 200) {
      messageWithKey.success(msg);
      if (props.handleEffect) {
        props.handleEffect();
      }
      resetFields();
      visible.value = false;
    } else {
      messageWithKey.error(msg);
    }
  } else {
    values.deptId = deptId.value;
    const { code, msg }: any = await editDeptData(values);
    if (code === 200) {
      messageWithKey.success(msg);
      resetFields();
      if (props.handleEffect) {
        props.handleEffect();
      }
      visible.value = false;
    } else {
      messageWithKey.error(msg);
    }
  }
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    destroy-on-close
    :width="640"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem
        v-if="!showDisabled(formState.parentId)"
        label="上级部门"
        v-bind="validateInfos.parentId"
      >
        <TreeSelect
          v-model:value="formState.parentId"
          show-search
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择部门"
          allow-clear
          tree-default-expand-all
          :tree-data="deptTreeOptions"
          tree-node-filter-prop="label"
          :field-names="{
            children: 'children',
            label: 'deptName',
            value: 'deptId',
          }"
        >
          <template #title="{ label }">
            {{ label }}
          </template>
        </TreeSelect>
      </FormItem>
      <FormItem label="部门名称" v-bind="validateInfos.deptName">
        <Input
          v-model:value="formState.deptName"
          placeholder="请输入部门名称"
        />
      </FormItem>
      <FormItem label="显示排序" v-bind="validateInfos.orderNum">
        <InputNumber
          v-model:value="formState.orderNum"
          placeholder="请输入显示排序"
          :min="1"
          :step="1"
        />
      </FormItem>
      <FormItem label="负责人" v-bind="validateInfos.leader">
        <Input v-model:value="formState.leader" placeholder="请输入负责人" />
      </FormItem>
      <FormItem label="联系电话" v-bind="validateInfos.phone">
        <Input v-model:value="formState.phone" placeholder="请输入联系电话" />
      </FormItem>
      <FormItem label="邮箱" v-bind="validateInfos.email">
        <Input v-model:value="formState.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_normal_disable"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
