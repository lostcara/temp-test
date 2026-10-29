<script setup lang="ts" name="DictTypeDetailsForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  RadioGroup,
  Select,
  Textarea,
} from 'ant-design-vue';

import { addDictData, editDictData, getDictDataDetails } from '/@/api/dict';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { filterOption } from '/@/utils/common';
import { TAG_COLOR_OPTIONS } from '/@/utils/consts';
import { RULE_LETTER_NUMBER, RULE_REMARK } from '/@/utils/rules';

interface FormState {
  cssClass: string;
  dictCode?: string;
  dictLabel: string;
  dictSort: number;
  dictType: string;
  dictValue: string;
  listClass: string;
  remark: string;
  status: string;
}

const props = defineProps({
  handleEffect: {
    default: () => {},
    type: Function,
  },
});

const useForm = Form.useForm;

const visible = ref<boolean>(false);
const dictCode = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_normal_disable']);

const formState: UnwrapRef<FormState> = reactive({
  cssClass: '',
  dictLabel: '',
  dictSort: 1,
  dictType: '',
  dictValue: '',
  remark: '',
  status: '0',
  listClass: 'primary',
});

const rulesRef = reactive({
  dictLabel: [
    { message: '请输入数据标签!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  dictSort: [{ message: '请输入显示排序!', required: true }],
  dictValue: [
    { message: '请输入数据键值!', required: true },
    RULE_LETTER_NUMBER,
    { max: 16, message: '长度不得超过16个字符!' },
  ],
  remark: [RULE_REMARK],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增字典数据' : '编辑字典数据';
});

const handleCancel = () => {
  dictCode.value = '';
  formState.status = '0';
  formState.dictSort = 1;
  formState.listClass = 'primary';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  formState.dictType = record.dictType;
  if (type === 'edit') {
    const { code, data, msg }: any = await getDictDataDetails(record.dictCode);
    if (code === 200) {
      dictCode.value = record.dictCode;
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
    const { code, msg }: any = await addDictData(values);
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
    values.dictCode = dictCode.value;
    const { code, msg }: any = await editDictData(values);
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
      <FormItem label="字典类型" v-bind="validateInfos.dictType">
        <Input
          v-model:value="formState.dictType"
          placeholder="请输入字典类型"
          disabled
        />
      </FormItem>
      <FormItem label="数据标签" v-bind="validateInfos.dictLabel">
        <Input
          v-model:value="formState.dictLabel"
          placeholder="请输入数据标签"
        />
      </FormItem>
      <FormItem label="数据键值" v-bind="validateInfos.dictValue">
        <Input
          v-model:value="formState.dictValue"
          placeholder="请输入数据键值"
        />
      </FormItem>
      <FormItem label="样式属性" v-bind="validateInfos.cssClass">
        <Input
          v-model:value="formState.cssClass"
          placeholder="请输入样式属性"
        />
      </FormItem>
      <FormItem label="显示排序" v-bind="validateInfos.dictSort">
        <InputNumber
          v-model:value="formState.dictSort"
          placeholder="请输入显示排序"
          :min="1"
          :step="1"
        />
      </FormItem>
      <FormItem label="回显样式" v-bind="validateInfos.listClass">
        <Select
          v-model:value="formState.listClass"
          :options="TAG_COLOR_OPTIONS"
          show-search
          :filter-option="filterOption"
          class="w-216"
          placeholder="请输入回显样式"
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
