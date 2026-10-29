<script setup lang="ts" name="UserForm">
import { computed, reactive, ref, UnwrapRef } from 'vue';

import { Form, FormItem, Modal } from 'ant-design-vue';

interface FormState {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
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
  return '设备信息';
});
const useForm = Form.useForm;

const formState: UnwrapRef<FormState> = reactive({
  field1: '',
  field2: '',
  field3: '',
  field4: '',
  field5: '',
  field6: '',
});

const rulesRef = reactive({
  // field1: [{ message: '请输入设备名称', required: true }],
  // field2: [{ message: '请选择新增日期', required: true }],
  // field3: [{ message: '请选择设备类型', required: true }],
  // field4: [{ message: '请选择设备类型', required: true }],
  // field5: [{ message: '请输入告警原因分析', required: true }],
  // field6: [{ message: '请输入告警原因分析', required: true }],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

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
  });
  visible.value = false;
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
      <FormItem label="设备名称" v-bind="validateInfos.field1">
        <!-- <Input v-model:value="formState.field1" placeholder="请输入设备名称" /> -->
        <span>毫米波雷达 </span>
      </FormItem>
      <FormItem label="设备类型" v-bind="validateInfos.field3">
        <!-- <Select
          v-model:value="formState.field3"
          :options="[
            {
              label: '摄像头',
              value: '摄像头',
            },
            {
              label: '毫米波雷达',
              value: '毫米波雷达',
            },
          ]"
          placeholder="请选择设备类型"
        /> -->
        <span>毫米波雷达 </span>
      </FormItem>
      <FormItem label="业务场景" v-bind="validateInfos.field5">
        <!-- <Select
          v-model:value="formState.field5"
          :options="[
            {
              label: '停车场进出管理',
              value: '停车场进出管理',
            },
            {
              label: '道路流量监控',
              value: '道路流量监控',
            },
          ]"
          placeholder="请选择业务场景"
        /> -->
        <span>停车场进出管理 </span>
      </FormItem>
      <FormItem label="型号配置" v-bind="validateInfos.field6">
        <!-- <Select
          v-model:value="formState.field6"
          :options="[
            {
              label: 'DTX31',
              value: 'DTX31',
            },
            {
              label: 'Mini25',
              value: 'Mini25',
            },
          ]"
          placeholder="请选择型号配置"
        /> -->
        <span>DTX31 </span>
      </FormItem>
    </Form>
  </Modal>
</template>
