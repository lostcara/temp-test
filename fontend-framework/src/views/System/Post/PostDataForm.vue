<script setup lang="ts" name="PostDataForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  RadioGroup,
  Textarea,
} from 'ant-design-vue';

import { addPostData, editPostData, getPostDataItem } from '/@/api/post';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { RULE_REMARK } from '/@/utils/rules';

interface FormState {
  postCode: string;
  postId?: string;
  postName: string;
  postSort: number;
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
const postId = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_normal_disable']);

const formState: UnwrapRef<FormState> = reactive({
  postCode: '',
  postName: '',
  postSort: 0,
  remark: '',
  status: '0',
});

const rulesRef = reactive({
  postCode: [
    { message: '请输入岗位编码!', required: true },
    { message: '岗位编码必须为小写字母', pattern: /^[a-z]+$/ },
    { max: 32, message: '长度不得超过32个字符!' },
  ],
  postName: [
    { message: '请输入岗位名称!', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  remark: [RULE_REMARK],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增岗位' : '编辑岗位';
});

const handleCancel = () => {
  postId.value = '';
  formState.status = '0';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getPostDataItem(record.postId);
    if (code === 200) {
      postId.value = record.postId;
      visible.value = true;
      formState.postName = data.postName;
      formState.postCode = data.postCode;
      formState.postSort = data.postSort;
      formState.status = data.status;
      formState.remark = data.remark;
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
    const { code, msg }: any = await addPostData(values);
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
    values.postId = postId.value;
    const { code, msg }: any = await editPostData(values);
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
      <FormItem label="岗位名称" v-bind="validateInfos.postName">
        <Input
          v-model:value="formState.postName"
          placeholder="请输入岗位名称"
        />
      </FormItem>
      <FormItem label="岗位编码" v-bind="validateInfos.postCode">
        <Input
          v-model:value="formState.postCode"
          placeholder="请输入岗位编码"
        />
      </FormItem>
      <FormItem label="岗位顺序" v-bind="validateInfos.postSort">
        <InputNumber
          v-model:value="formState.postSort"
          placeholder="请输入岗位顺序"
          :min="1"
          :step="1"
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
