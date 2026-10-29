<script setup lang="ts" name="UserForm">
import { computed, reactive, ref, UnwrapRef } from 'vue';

import { Col, Form, FormItem, Modal, Row, Table } from 'ant-design-vue';

import BarCharts from './BarCharts.vue';
import RadarCharts from './RadarCharts.vue';

interface FormState {
  date: any;
  field1: string;
}

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const visible = ref<boolean>(false);
const userId = ref('');
const status = ref('add');
const title = computed(() => {
  return '设备状态详情';
});
const useForm = Form.useForm;

const formState: UnwrapRef<FormState> = reactive({
  date: [],
  field1: '',
});

const rulesRef = reactive({});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const columns = [
  {
    dataIndex: 'field1',
    key: 'field1',
    title: '异常ID',
  },
  {
    dataIndex: 'field2',
    key: 'field2',
    title: '设备类型',
  },
  {
    dataIndex: 'field3',
    key: 'field3',
    title: '业务场景',
  },
  {
    dataIndex: 'field4',
    key: 'field4',
    title: '异常类型',
  },
  {
    dataIndex: 'field5',
    key: 'field5',
    title: '发生时间',
  },
  {
    dataIndex: 'field6',
    key: 'field6',
    title: '处置时间',
  },
  {
    dataIndex: 'field7',
    key: 'field7',
    title: '负责人',
  },
];

const dataSource = [
  {
    field1: '4000004',
    field2: '摄像头',
    field3: '停车场进出管理',
    field4: '感知类专用设备',
    field5: '2025-03-02',
    field6: '2025-03-02',
    field7: '管理员',
  },
  {
    field1: '5000005',
    field2: '毫米波雷达',
    field3: '道路流量实时监控',
    field4: '感知类专用设备',
    field5: '2025-03-02',
    field6: '2025-03-02',
    field7: '管理员',
  },
];
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

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :title="title"
    destroy-on-close
    :width="1080"
    @ok="handleSubmit"
    @cancel="cancel"
  >
    <Form>
      <Row>
        <Col :span="12">
          <FormItem label="设备名称">
            <!-- <Input
              v-model:value="formState.field1"
              placeholder="请输入设备名称"
              style="width: 80%"
            /> -->
            <span>摄像头</span>
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="采购日期">
            <!-- <RangePicker v-model:value="formState.date" style="width: 80%" /> -->
            2025-03-27
          </FormItem>
        </Col>
        <Col :span="24">
          <FormItem label="历史记录" v-bind="validateInfos.userName" />
          <Table :columns="columns" :data-source="dataSource" />
        </Col>
        <Col :span="12">
          <BarCharts style="height: 400px" />
        </Col>
        <Col :span="12">
          <RadarCharts style="height: 400px" />
        </Col>
      </Row>
    </Form>
  </Modal>
</template>
