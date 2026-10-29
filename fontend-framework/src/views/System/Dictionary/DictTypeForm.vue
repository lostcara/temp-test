<script setup lang="ts" name="DictTypeForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  Modal,
  RadioGroup,
  Textarea,
} from 'ant-design-vue';

import { addDictType, editDictType, getDictTypeDetails } from '/@/api/dict';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { RULE_REMARK } from '/@/utils/rules';

interface FormState {
  dictId?: string;
  dictName: string;
  dictType: string;
  remark: string;
  status: string;
}

const props = defineProps({
  handleEffect: {
    required: true,
    type: Function,
  },
});

const useForm = Form.useForm;

const visible = ref<boolean>(false);
const dictId = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_normal_disable']);

const formState: UnwrapRef<FormState> = reactive({
  dictName: '',
  dictType: '',
  remark: '',
  status: '0',
});

const rulesRef = reactive({
  dictName: [
    { message: '请输入字典名称!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  dictType: [
    { message: '请输入字典类型!', required: true },
    {
      message: '字典类型必须为小写字母和下划线!',
      pattern: /^\(?!_\)[a-z][a-z_]*[a-z]$/,
    },
  ],
  remark: [RULE_REMARK],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增字典' : '编辑字典';
});

const handleCancel = () => {
  dictId.value = '';
  formState.status = '0';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getDictTypeDetails(record.dictId);
    if (code === 200) {
      dictId.value = record.dictId;
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
    const { code, msg }: any = await addDictType(values);
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
    values.dictId = dictId.value;
    const { code, msg }: any = await editDictType(values);
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
      <FormItem label="字典名称" v-bind="validateInfos.dictName">
        <Input
          v-model:value="formState.dictName"
          placeholder="请输入字典名称"
        />
      </FormItem>
      <FormItem label="字典类型" v-bind="validateInfos.dictType">
        <Input
          v-model:value="formState.dictType"
          placeholder="请输入字典类型"
        />
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_normal_disable"
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
