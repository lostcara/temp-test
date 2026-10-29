<script setup lang="ts" name="ConfigForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  Modal,
  RadioGroup,
  Textarea,
} from 'ant-design-vue';

import { addConfig, editConfig, getConfigDetails } from '/@/api/config';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { RULE_REMARK } from '/@/utils/rules';

interface FormState {
  configId?: string;
  configKey: string;
  configName: string;
  configType: string;
  configValue: string;
  remark: string;
}

const props = defineProps({
  handleEffect: {
    required: true,
    type: Function,
  },
});

const useForm = Form.useForm;

const visible = ref<boolean>(false);
const configId = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_yes_no']);

const formState: UnwrapRef<FormState> = reactive({
  configKey: '',
  configName: '',
  configType: 'Y',
  configValue: '',
  remark: '',
});

const rulesRef = reactive({
  configKey: [
    { message: '请输入参数键名!', required: true },
    {
      message: '参数键名必须为字母和点!',
      pattern: /^\(?!\.\)[a-z][a-z.]*[a-z]$/i,
    },
  ],
  configName: [
    { message: '请输入参数名称!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  configValue: [
    { message: '请输入参数键值!', required: true },
    {
      message: '参数键值必须为小写字母,数字和短横线!',
      pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/,
    },
  ],
  remark: [RULE_REMARK],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增参数' : '编辑参数';
});

const handleCancel = () => {
  configId.value = '';
  formState.configType = '0';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getConfigDetails(record.configId);
    if (code === 200) {
      configId.value = record.configId;
      visible.value = true;
      Object.assign(formState, data);
    } else {
      messageWithKey.error(msg);
    }
  } else {
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
    const { code, msg }: any = await addConfig(values);
    if (code === 200) {
      messageWithKey.success(msg);
      if (props.handleEffect) {
        props.handleEffect(status.value);
      }
      resetFields();
      visible.value = false;
    } else {
      messageWithKey.error(msg);
    }
  } else {
    values.configId = configId.value;
    const { code, msg }: any = await editConfig(values);
    if (code === 200) {
      messageWithKey.success(msg);
      resetFields();
      if (props.handleEffect) {
        props.handleEffect(status.value);
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
      <FormItem label="参数名称" v-bind="validateInfos.configName">
        <Input
          v-model:value="formState.configName"
          placeholder="请输入参数名称"
        />
      </FormItem>
      <FormItem label="参数键名" v-bind="validateInfos.configKey">
        <Input
          v-model:value="formState.configKey"
          placeholder="请输入参数键名"
        />
      </FormItem>
      <FormItem label="参数键值" v-bind="validateInfos.configValue">
        <Input
          v-model:value="formState.configValue"
          placeholder="请输入参数键值"
        />
      </FormItem>
      <FormItem label="系统内置" v-bind="validateInfos.configType">
        <RadioGroup
          v-model:value="formState.configType"
          :options="dictType.sys_yes_no"
        />
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
