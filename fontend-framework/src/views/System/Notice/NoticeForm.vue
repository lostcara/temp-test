<script setup lang="ts" name="NoticeForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import {
  Form,
  FormItem,
  Input,
  Modal,
  RadioGroup,
  Select,
} from 'ant-design-vue';

import { addNoticeData, editNoticeData, getNoticeDetails } from '/@/api/notice';
import AlphaEditor from '/@/components/AlphaEditor/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { filterOption } from '/@/utils/common';

interface FormState {
  noticeContent: string;
  noticeId?: string;
  noticeTitle: string;
  noticeType: string | undefined;
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
const noticeId = ref<string>('');
const status = ref<string>('add');
const { dictType } = useDictType(['sys_notice_type', 'sys_notice_status']);

const formState: UnwrapRef<FormState> = reactive({
  noticeContent: '',
  noticeTitle: '',
  noticeType: undefined,
  status: '0',
});

const rulesRef = reactive({
  noticeTitle: [
    { message: '请输入公告标题!', required: true },
    { max: 50, message: '长度不得超过50个字符!' },
  ],
  noticeType: [{ message: '请选择公告类型!', required: true }],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const title = computed(() => {
  return status.value === 'add' ? '新增公告' : '编辑公告';
});

const handleCancel = () => {
  noticeId.value = '';
  formState.status = '0';
  resetFields();
};

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getNoticeDetails(record.noticeId);
    if (code === 200) {
      noticeId.value = record.noticeId;
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
    const { code, msg }: any = await addNoticeData(values);
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
    values.noticeId = noticeId.value;
    const { code, msg }: any = await editNoticeData(values);
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
    :width="1080"
    :title="title"
    destroy-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <FormItem label="公告标题" v-bind="validateInfos.noticeTitle">
        <Input
          v-model:value="formState.noticeTitle"
          placeholder="请输入公告标题"
        />
      </FormItem>
      <FormItem label="公告类型" v-bind="validateInfos.noticeType">
        <Select
          v-model:value="formState.noticeType"
          :options="dictType.sys_notice_type"
          show-search
          :filter-option="filterOption"
          placeholder="请输入公告类型"
          allow-clear
        />
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_notice_status"
        />
      </FormItem>
      <FormItem label="内容" v-bind="validateInfos.noticeContent">
        <AlphaEditor v-model="formState.noticeContent" />
      </FormItem>
    </Form>
  </Modal>
</template>
