<script setup lang="ts" name="UserForm">
import { computed, reactive, ref, UnwrapRef } from 'vue';

import { Button, Form, FormItem, Modal } from 'ant-design-vue';

import useDownload from '/@/hooks/useDownload';

interface FormState {
  remark?: string;
}

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };

const visible = ref<boolean>(false);
const userId = ref('');
const status = ref('add');
const title = computed(() => {
  return '异常告警信息原因追溯';
});
const useForm = Form.useForm;

const formState: UnwrapRef<FormState> = reactive({
  remark: '',
});

const rulesRef = reactive({});

const { resetFields, validate } = useForm(formState, rulesRef);

const showModal = async (type: string) => {
  status.value = type;
  visible.value = true;
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
    if (props.afterSave) {
      props.afterSave();
    }
    visible.value = false;
  });
};
const { handleDownload } = useDownload();
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
      <FormItem label="告警原因分析">
        <!-- <Textarea
          v-model:value="formState.remark"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入告警原因分析"
        /> -->
        <span>设备摄像头出现异常</span>
      </FormItem>
      <FormItem label="相关文件附件">
        <div>
          <span>设备异常分析报告</span>
          <Button
            type="primary"
            style="margin-left: 10px"
            @click="handleDownload('设备异常分析报告')"
          >
            下载
          </Button>
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>
