<script setup lang="ts" name="CronJobForm">
import { computed, reactive, ref, toRaw, UnwrapRef } from 'vue';

import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import {
  Form,
  FormItem,
  Input,
  Modal,
  RadioGroup,
  Select,
  Tooltip,
} from 'ant-design-vue';

import { addCronJob, editCronJob, getCronJobDetails } from '/@/api/cronJob';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';

interface FormState {
  concurrent: any;
  cronExpression: string;
  invokeTarget: string;
  jobGroup: string | undefined;
  jobId?: string;
  jobName: string;
  misfirePolicy: string;
  status: string;
}

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});
const labelCol = { span: 6 };
const wrapperCol = { span: 14 };
// 执行策略
const misfirePolicyOptions = [
  {
    label: '立即执行',
    value: '1',
  },
  {
    label: '执行一次',
    value: '2',
  },
  {
    label: '放弃执行',
    value: '3',
  },
];
// 是否并发
const concurrentOptions = [
  {
    label: '允许',
    value: '0',
  },
  {
    label: '禁止',
    value: '1',
  },
];

const { dictType } = useDictType(['sys_job_group', 'sys_job_status']);

const visible = ref<boolean>(false);
const jobId = ref('');
const status = ref('add');
const title = computed(() => {
  return status.value === 'add' ? '新增定时任务' : '编辑定时任务';
});
const useForm = Form.useForm;

const formState: UnwrapRef<FormState> = reactive({
  concurrent: '1',
  cronExpression: '',
  invokeTarget: '',
  jobGroup: undefined,
  jobName: '',
  misfirePolicy: '3',
  status: '1',
});

const rulesRef = reactive({
  concurrent: [{ message: '请选择是否并发', required: true }],
  cronExpression: [{ message: '请输入cron表达式', required: true }],
  invokeTarget: [{ message: '请输入调用方法', required: true }],
  jobGroup: [{ message: '请选择任务分组', required: true }],
  jobName: [
    { message: '请输入任务名称', required: true },
    { max: 20, message: '长度不得超过20个字符!' },
  ],
  misfirePolicy: [{ message: '请选择执行策略', required: true }],
  status: [{ message: '请选择状态', required: true }],
});

const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

const showModal = async (type: string, record: any) => {
  status.value = type;
  if (type === 'edit') {
    const { code, data, msg }: any = await getCronJobDetails(record.jobId);
    if (code === 200) {
      formState.jobName = data.jobName;
      formState.jobGroup = data.jobGroup;
      formState.invokeTarget = data.invokeTarget;
      formState.cronExpression = data.cronExpression;
      formState.status = data.status;
      formState.misfirePolicy = data.misfirePolicy;
      formState.concurrent = data.concurrent;
      jobId.value = record.jobId;
      visible.value = true;
    } else {
      messageWithKey.error(msg);
    }
  } else {
    visible.value = true;
  }
};

const clearEffect = () => {
  jobId.value = '';
  resetFields();
};

const cancel = () => {
  clearEffect();
  visible.value = false;
};

const handleSubmit = async () => {
  validate().then(async () => {
    if (status.value === 'add') {
      const { code, msg }: any = await addCronJob(toRaw(formState));
      if (code === 200) {
        messageWithKey.success(msg);
        if (props.afterSave) {
          props.afterSave();
        }
        // 刷新
        clearEffect();
        visible.value = false;
      } else {
        messageWithKey.error(msg);
      }
    } else {
      const { code, msg }: any = await editCronJob({
        ...toRaw(formState),
        jobId: jobId.value,
      });
      if (code === 200) {
        messageWithKey.success(msg);
        if (props.afterSave) {
          props.afterSave();
        }
        // 刷新
        clearEffect();
        visible.value = false;
      } else {
        messageWithKey.error(msg);
      }
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
    :width="640"
    @ok="handleSubmit"
    @cancel="cancel"
  >
    <Form :label-col="labelCol" :wrapper-col="wrapperCol">
      <FormItem label="任务名称" v-bind="validateInfos.jobName">
        <Input v-model:value="formState.jobName" placeholder="请输入任务名称" />
      </FormItem>
      <FormItem label="任务分组" v-bind="validateInfos.jobGroup">
        <Select
          v-model:value="formState.jobGroup"
          :options="dictType.sys_job_group"
          placeholder="请选择任务分组"
        />
      </FormItem>
      <FormItem v-bind="validateInfos.invokeTarget">
        <template #label>
          <span>
            <span>调用方法</span>
            <Tooltip>
              <template #title>
                <div>
                  Bean调用示例:ryTask.ryParams('ry')
                  <br />Class类调用示例:com.ruoyi.quartz.task.RyTask.ryParams('ry')
                  <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                </div>
              </template>
              <QuestionCircleOutlined class="padding-left-4" />
            </Tooltip>
          </span>
        </template>
        <Input
          v-model:value="formState.invokeTarget"
          placeholder="请输入调用目标字符串"
        />
      </FormItem>
      <FormItem label="cron表达式" v-bind="validateInfos.cronExpression">
        <Input
          v-model:value="formState.cronExpression"
          placeholder="请输入cron表达式"
        />
      </FormItem>
      <FormItem label="状态" v-bind="validateInfos.status">
        <RadioGroup
          v-model:value="formState.status"
          :options="dictType.sys_job_status"
        />
      </FormItem>
      <FormItem label="执行策略">
        <RadioGroup
          v-model:value="formState.misfirePolicy"
          option-type="button"
          button-style="solid"
          :options="misfirePolicyOptions"
        />
      </FormItem>
      <FormItem label="是否并发">
        <RadioGroup
          v-model:value="formState.concurrent"
          option-type="button"
          button-style="solid"
          :options="concurrentOptions"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
