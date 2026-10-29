<script setup lang="ts" name="DetailsForm">
import { computed, reactive, ref, UnwrapRef } from 'vue';

import { Button, Form, FormItem, Modal } from 'ant-design-vue';

import RadarCharts from './RadarCharts.vue';

import useDownload from '/@/hooks/useDownload';
import type { DevicePortraitItem } from '/@/api/devicePortrait';

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});
const { handleDownload } = useDownload();
interface FormState {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
}

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };

const visible = ref<boolean>(false);
const userId = ref('');
const status = ref('add');
const currentRecord = ref<DevicePortraitItem | null>(null);

const title = computed(() => {
  return '设备画像';
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

const { resetFields, validate } = useForm(formState, rulesRef);

const showModal = async (record: DevicePortraitItem) => {
  currentRecord.value = record;
  Object.assign(formState, record);
  status.value = 'view';
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
    :width="840"
    @ok="handleSubmit"
    @cancel="cancel"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem :wrapper-col="{ offset: 6, span: 18 }">
        <RadarCharts
          v-if="currentRecord"
          :asset-importance="currentRecord.assetImportance ?? 0"
          :data-importance="currentRecord.dataImportance ?? 0"
          :network-importance="currentRecord.networkImportance ?? 0"
          :business-importance="currentRecord.businessImportance ?? 0"
          style="height: 400px"
        />
      </FormItem>
      <FormItem :wrapper-col="{ offset: 6, span: 14 }">
        <div>
          <div>安全防护配置建议下载</div>
          <Button type="primary" @click="handleDownload('安全防护配置建议')">
            下载
          </Button>
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>
