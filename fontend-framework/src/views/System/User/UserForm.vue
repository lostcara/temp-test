<script setup lang="ts" name="UserForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  Modal,
  // InputPassword,
  RadioGroup,
  Select,
  Textarea,
  TreeSelect,
} from 'ant-design-vue';
import { SelectValue } from 'ant-design-vue/es/select';

import useDeptTreeOptions from './useDeptTreeOptions';
import useRoleAndPostOptions from './useRoleAndPostOptions';

import { addUserData, editUserData, getUserData } from '/@/api/user';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  RULE_EMAIL,
  RULE_PASSWORD,
  RULE_PHONE,
  RULE_REMARK,
} from '/@/utils/rules';

interface FormState {
  deptId: any;
  email: string;
  nickName: string;
  password?: string;
  phonenumber: string;
  postIds: SelectValue;
  remark?: string;
  roleIds: SelectValue;
  sex: string;
  status: string;
  userId?: string;
  userName: string;
}

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const { dictType } = useDictType(['sys_normal_disable', 'sys_user_sex']);
const { postOptions, roleOptions } = useRoleAndPostOptions();
const { deptTreeOptions } = useDeptTreeOptions();

const visible = ref<boolean>(false);
const userId = ref('');
const status = ref('add');
const title = computed(() => {
  return status.value === 'add' ? '新增用户' : '编辑用户';
});
const useForm = Form.useForm;

const formState: UnwrapRef<FormState> = reactive({
  deptId: null,
  email: '',
  nickName: '',
  password: '',
  phonenumber: '',
  postIds: [],
  remark: '',
  roleIds: [],
  sex: '0',
  status: '0',
  userName: '',
});

const rulesRef = reactive({
  email: [RULE_EMAIL],
  nickName: [
    { message: '请输入用户昵称', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  password: [RULE_PASSWORD],
  phonenumber: [RULE_PHONE],
  remark: [RULE_REMARK],
  userName: [
    { message: '请输入用户名称', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const {
      code,
      data,
      msg,
      postIds = [],
      roleIds = [],
    }: any = await getUserData(record.userId);
    if (code === 200) {
      formState.nickName = data.nickName;
      formState.userName = data.userName;
      formState.sex = data.sex;
      formState.phonenumber = data.phonenumber;
      formState.email = data.email;
      formState.postIds = postIds;
      formState.roleIds = roleIds;
      formState.deptId = data.deptId;
      formState.status = data.status;
      formState.remark = data.remark;
      userId.value = record.userId;
      visible.value = true;
    } else {
      messageWithKey.error(msg);
    }
  } else {
    visible.value = true;
  }
};

const clearEffect = () => {
  userId.value = '';
  resetFields();
};

const cancel = () => {
  clearEffect();
  visible.value = false;
};

const handleSubmit = async () => {
  validate().then(async () => {
    if (status.value === 'add') {
      const { code, msg }: any = await addUserData(toRaw(formState));
      if (code === 200) {
        messageWithKey.success(msg);
        if (props.afterSave) {
          props.afterSave();
        }
        // 刷新
        clearEffect();
        visible.value = false;
      } else {
        messageWithKey.error(msg);
      }
    } else {
      const { code, msg }: any = await editUserData({
        ...toRaw(formState),
        userId: userId.value,
      });
      if (code === 200) {
        messageWithKey.success(msg);
        if (props.afterSave) {
          props.afterSave();
        }
        // 刷新
        clearEffect();
        visible.value = false;
      } else {
        messageWithKey.error(msg);
      }
    }
  });
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :title="title"
    destroy-on-close
    :width="640"
    @ok="handleSubmit"
    @cancel="cancel"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem label="用户昵称" v-bind="validateInfos.nickName">
        <Input
          v-model:value="formState.nickName"
          placeholder="请输入用户昵称"
        />
      </FormItem>
      <FormItem label="用户名称" v-bind="validateInfos.userName">
        <Input
          v-model:value="formState.userName"
          placeholder="请输入用户名称"
        />
      </FormItem>
      <!-- <FormItem v-if="status === 'add'" label="用户密码" v-bind="validateInfos.password">
        <InputPassword v-model:value="formState.password" placeholder="请输入用户密码" />
      </FormItem> -->
      <FormItem label="角色" v-bind="validateInfos.roleIds">
        <Select
          v-model:value="formState.roleIds"
          mode="multiple"
          :options="roleOptions"
          placeholder="请选择角色"
        />
      </FormItem>
      <FormItem label="岗位" v-bind="validateInfos.postIds">
        <Select
          v-model:value="formState.postIds"
          :options="postOptions"
          allow-clear
          placeholder="请选择岗位"
        />
      </FormItem>
      <FormItem label="归属部门" v-bind="validateInfos.deptId">
        <TreeSelect
          v-model:value="formState.deptId"
          show-search
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择归属部门"
          allow-clear
          tree-default-expand-all
          :tree-data="deptTreeOptions"
          tree-node-filter-prop="label"
          :field-names="{ children: 'children', label: 'label', value: 'id' }"
        >
          <template #title="{ label }">
            {{ label }}
          </template>
        </TreeSelect>
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_normal_disable"
        />
      </FormItem>
      <FormItem label="用户性别">
        <RadioGroup
          v-model:value="formState.sex"
          :options="dictType.sys_user_sex"
        />
      </FormItem>
      <FormItem label="手机号码" v-bind="validateInfos.phonenumber">
        <Input
          v-model:value="formState.phonenumber"
          placeholder="请输入手机号码"
        />
      </FormItem>
      <FormItem label="邮箱" v-bind="validateInfos.email">
        <Input v-model:value="formState.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="备注" v-bind="validateInfos.remark">
        <Textarea
          v-model:value="formState.remark"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入备注"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
