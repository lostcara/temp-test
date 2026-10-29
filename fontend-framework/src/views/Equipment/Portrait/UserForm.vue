<script setup lang="ts" name="UserForm">
import { computed, reactive, ref } from 'vue';

import { Form, FormItem, Input, Modal, Select, Slider } from 'ant-design-vue';

import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  createDevicePortrait,
  updateDevicePortrait,
  type DevicePortraitItem,
} from '/@/api/devicePortrait';

interface FormState {
  deviceName: string;
  deviceNumber: string;
  deviceType: string;
  businessScenario: string;
  portrait: string;
  protectionPlan: string;
  assetImportance?: number;
  dataImportance?: number;
  networkImportance?: number;
  businessImportance?: number;
}

type FormType = 'ADD' | 'EDIT';

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };

const visible = ref<boolean>(false);
const currentId = ref<string>('');
const formType = ref<FormType>('ADD');
const loading = ref<boolean>(false);

const title = computed(() => {
  return formType.value === 'ADD' ? '新增设备画像' : '编辑设备画像';
});

const useForm = Form.useForm;
const formState = reactive<FormState>({
  deviceName: '',
  deviceNumber: '',
  deviceType: '',
  businessScenario: '',
  portrait: '',
  protectionPlan: '',
  assetImportance: 0,
  dataImportance: 0,
  networkImportance: 0,
  businessImportance: 0,
});

const rulesRef = reactive({
  deviceName: [{ message: '请输入设备名称', required: true, trigger: 'blur' }],
  deviceNumber: [
    { message: '请输入设备编号', required: true, trigger: 'blur' },
  ],
  deviceType: [{ message: '请选择设备类型', required: true, trigger: 'blur' }],
  businessScenario: [
    { message: '请选择业务场景', required: true, trigger: 'blur' },
  ],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const showModal = async (
  type: FormType,
  record?: DevicePortraitItem | null,
) => {
  formType.value = type;
  currentId.value = record?.id || '';

  if (type === 'EDIT' && record) {
    // 编辑模式：填充表单数据
    Object.assign(formState, {
      deviceName: record.deviceName || '',
      deviceNumber: record.deviceNumber || '',
      deviceType: record.deviceType || '',
      businessScenario: record.businessScenario || '',
      portrait: record.portrait || '',
      protectionPlan: record.protectionPlan || '',
      assetImportance: record.assetImportance ?? 0,
      dataImportance: record.dataImportance ?? 0,
      networkImportance: record.networkImportance ?? 0,
      businessImportance: record.businessImportance ?? 0,
    });
  } else {
    // 新增模式：重置表单
    resetFields();
    Object.assign(formState, {
      deviceName: '',
      deviceNumber: '',
      deviceType: '',
      businessScenario: '',
      portrait: '',
      protectionPlan: '',
      assetImportance: 0,
      dataImportance: 0,
      networkImportance: 0,
      businessImportance: 0,
    });
  }

  visible.value = true;
};

const clearEffect = () => {
  currentId.value = '';
  resetFields();
  Object.assign(formState, {
    deviceName: '',
    deviceNumber: '',
    deviceType: '',
    businessScenario: '',
    portrait: '',
    protectionPlan: '',
    assetImportance: 0,
    dataImportance: 0,
    networkImportance: 0,
    businessImportance: 0,
  });
};

const cancel = () => {
  clearEffect();
  visible.value = false;
};

const handleSubmit = async () => {
  try {
    await validate();
    loading.value = true;

    const submitData: Partial<DevicePortraitItem> = {
      deviceName: formState.deviceName,
      deviceNumber: formState.deviceNumber,
      deviceType: formState.deviceType,
      businessScenario: formState.businessScenario,
      portrait: formState.portrait,
      protectionPlan: formState.protectionPlan,
      assetImportance: formState.assetImportance ?? 0,
      dataImportance: formState.dataImportance ?? 0,
      networkImportance: formState.networkImportance ?? 0,
      businessImportance: formState.businessImportance ?? 0,
    };

    let result: any;
    if (formType.value === 'ADD') {
      result = await createDevicePortrait(submitData);
    } else {
      if (!currentId.value) {
        messageWithKey.error('缺少记录ID');
        return;
      }
      result = await updateDevicePortrait(currentId.value, submitData);
    }

    if (result.code === 200) {
      messageWithKey.success(
        formType.value === 'ADD' ? '新增成功' : '更新成功',
      );
      visible.value = false;
      clearEffect();
      if (props.afterSave) {
        props.afterSave(formType.value === 'ADD' ? 'add' : 'edit');
      }
    } else {
      messageWithKey.error(result.message || '操作失败');
    }
  } catch (error: any) {
    console.error('提交失败', error);
    if (error?.errorFields) {
      // 表单验证错误
      return;
    }
    messageWithKey.error(error?.message || '操作失败');
  } finally {
    loading.value = false;
  }
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
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="cancel"
    :ok-text="formType === 'ADD' ? '确定' : '更新'"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem label="设备名称" v-bind="validateInfos.deviceName">
        <Input
          v-model:value="formState.deviceName"
          placeholder="请输入设备名称"
        />
      </FormItem>
      <FormItem label="设备编号" v-bind="validateInfos.deviceNumber">
        <Input
          v-model:value="formState.deviceNumber"
          placeholder="请输入设备编号"
          :disabled="formType === 'EDIT'"
        />
      </FormItem>
      <FormItem label="设备类型" v-bind="validateInfos.deviceType">
        <Select
          v-model:value="formState.deviceType"
          :options="[
            {
              label: 'ETC自助发行终端',
              value: 'ETC自助发行终端',
            },
            {
              label: 'ETC手持发行终端',
              value: 'ETC手持发行终端',
            },
            {
              label: 'ETC OBU',
              value: 'ETC OBU',
            },
            {
              label: '车道岛头节点',
              value: '车道岛头节点',
            },
            {
              label: '车道岛尾节点',
              value: '车道岛尾节点',
            },
            {
              label: '收费机器人',
              value: '收费机器人',
            },
            {
              label: '手持特情终端',
              value: '手持特情终端',
            },
            {
              label: 'RSU',
              value: 'RSU',
            },
            {
              label: '摄像头',
              value: '摄像头',
            },
            {
              label: '激光雷达',
              value: '激光雷达',
            },
            {
              label: '毫米波雷达',
              value: '毫米波雷达',
            },
            {
              label: '感知类专用设备',
              value: '感知类专用设备',
            },
            {
              label: '传感器类设备',
              value: '传感器类设备',
            },
          ]"
          placeholder="请选择设备类型"
        />
      </FormItem>
      <FormItem label="业务场景" v-bind="validateInfos.businessScenario">
        <Select
          v-model:value="formState.businessScenario"
          :options="[
            {
              label: 'ETC发行',
              value: 'ETC发行',
            },
            {
              label: '高速ETC收费',
              value: '高速ETC收费',
            },
            {
              label: '停车场ETC收费',
              value: '停车场ETC收费',
            },
            {
              label: '高速路况监测',
              value: '高速路况监测',
            },
            {
              label: '停车场进出管理',
              value: '停车场进出管理',
            },
            {
              label: '道路流量实时监控',
              value: '道路流量实时监控',
            },
          ]"
          placeholder="请选择业务场景"
        />
      </FormItem>
      <FormItem label="资产重要性">
        <div style="display: flex; align-items: center; gap: 12px">
          <Slider
            v-model:value="formState.assetImportance"
            :min="0"
            :max="230"
            style="flex: 1"
          />
          <span style="min-width: 50px; text-align: right">
            {{ formState.assetImportance }}
          </span>
        </div>
      </FormItem>
      <FormItem label="数据重要性">
        <div style="display: flex; align-items: center; gap: 12px">
          <Slider
            v-model:value="formState.dataImportance"
            :min="0"
            :max="230"
            style="flex: 1"
          />
          <span style="min-width: 50px; text-align: right">
            {{ formState.dataImportance }}
          </span>
        </div>
      </FormItem>
      <FormItem label="网络重要性">
        <div style="display: flex; align-items: center; gap: 12px">
          <Slider
            v-model:value="formState.networkImportance"
            :min="0"
            :max="230"
            style="flex: 1"
          />
          <span style="min-width: 50px; text-align: right">
            {{ formState.networkImportance }}
          </span>
        </div>
      </FormItem>
      <FormItem label="业务重要性">
        <div style="display: flex; align-items: center; gap: 12px">
          <Slider
            v-model:value="formState.businessImportance"
            :min="0"
            :max="230"
            style="flex: 1"
          />
          <span style="min-width: 50px; text-align: right">
            {{ formState.businessImportance }}
          </span>
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>
