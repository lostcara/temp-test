<script setup lang="ts">
import { reactive, ref, toRaw, UnwrapRef } from 'vue';

import { Form, FormItem, Modal, Select } from 'ant-design-vue';
import { SelectValue } from 'ant-design-vue/es/select';

import { getAuthRoleOptions, userAssigningRoles } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';

interface FormState {
  roleId: SelectValue;
}

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const roleOptions = ref<any[]>([]);
const visible = ref<boolean>(false);
const useForm = Form.useForm;
const rowData = ref<any>({});

const formState: UnwrapRef<FormState> = reactive({
  roleId: [],
});

const rulesRef = reactive({
  roleId: [{ message: '请选择角色', required: true }],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const showModal = async (record: any) => {
  const {
    code,
    msg,
    roles = [],
    user,
  }: any = await getAuthRoleOptions(record.userId);
  if (code === 200) {
    roleOptions.value = roles.map((k: any) => ({
      ...k,
      label: k.roleName,
      value: k.roleId,
    }));
    rowData.value = record;
    if (user.roles && user.roles.length > 0) {
      formState.roleId = user.roles.map((k: any) => k.roleId);
    }
    visible.value = true;
  } else {
    messageWithKey.error(msg);
  }
};

const clearEffect = () => {
  rowData.value = {};
  resetFields();
};

const cancel = () => {
  clearEffect();
  visible.value = false;
};

const handleSubmit = async () => {
  validate().then(async () => {
    const { code, msg }: any = await userAssigningRoles({
      ...toRaw(formState),
      userId: rowData.value.userId,
    });
    if (code === 200) {
      messageWithKey.success(msg);
      if (props.afterSave) {
        props.afterSave();
      }
      clearEffect();
      visible.value = false;
    } else {
      // 刷新
      messageWithKey.error(msg);
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
    title="分配角色"
    destroy-on-close
    :width="640"
    @ok="handleSubmit"
    @cancel="cancel"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem label="角色" v-bind="validateInfos.roleId">
        <Select
          v-model:value="formState.roleId"
          mode="multiple"
          :options="roleOptions"
          placeholder="请选择角色"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
