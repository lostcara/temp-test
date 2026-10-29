<script setup lang="ts" name="CronJob">
import { computed, createVNode, onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'ant-design-vue';
import cronstrue from 'cronstrue';

import CronJobForm from './CronJobForm.vue';

import 'cronstrue/locales/zh_CN';

import {
  changeCronJobStatus,
  deleteCronJob,
  exportCronJob,
  getCronJobDataByPage,
  runCronJob,
} from '/@/api/cronJob';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import {
  PAGE_SIZE_OPTIONS,
  STATUS_DEFAULT_NORMAL,
  STATUS_DEFAULT_STOP,
} from '/@/utils/consts';

const router = useRouter();
const { dictType } = useDictType(['sys_job_group', 'sys_job_status']);

// 任务表单
const refTaskForm = ref();

const jobGroup = ref<string>();
const status = ref<string>();
const searchValue = ref<string>('');
const selectedRowKeys = ref<string[]>([]);

// 表格
const loading = ref<boolean>(false);
const dataSource = ref([]);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const columns = [
  {
    dataIndex: 'jobName',
    ellipsis: true,
    title: '任务名称',
  },
  {
    dataIndex: 'jobGroup',
    ellipsis: true,
    title: '任务组名',
  },
  {
    dataIndex: 'invokeTarget',
    ellipsis: true,
    title: '调用目标字符串',
  },
  {
    dataIndex: 'cronExpression',
    ellipsis: true,
    title: 'cron执行表达式',
  },
  {
    dataIndex: 'cronText',
    ellipsis: true,
    title: 'cron转译',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '状态',
  },
  {
    dataIndex: 'operate',
    title: '操作',
  },
];

const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: any) => `共${total}条`,
  total: total.value,
}));

const rowSelection: any = computed(() => {
  return {
    onChange: onSelectChange,
    selectedRowKeys: unref(selectedRowKeys),
  };
});

const onSelectChange = (changableRowKeys: string[]) => {
  selectedRowKeys.value = changableRowKeys;
};

const handleTableChange: any = (pag: { current: number; pageSize: number }) => {
  pageSize.value = pag.pageSize;
  current.value = pag.current;
  getData();
};

// 显示 任务表单
const showTaskForm = (type: string, record: any) => {
  refTaskForm.value.showModal(type, record);
};

// 删除任务
const deleteTaskApi = async (id: string) => {
  const { code, msg }: any = await deleteCronJob(id);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const confirmTask = async (jobId: string) => {
  deleteTaskApi(jobId);
};

// 批量删除 任务
const showDeleteConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    // content: 'Some descriptions',
    okType: 'danger',
    onCancel() {},
    onOk() {
      deleteTaskApi(selectedRowKeys.value.join(','));
    },
    title: '是否删除选中任务?',
  });
};

// 执行任务
const confirmExecute = async (record: any) => {
  const { code, msg }: any = await runCronJob({
    jobGroup: record.jobGroup,
    jobId: record.jobId,
  });
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const cancel = () => {};

// 展示弹框 改变任务状态
const showConfirm = (checked: string, record: any) => {
  const item = dictType.value.sys_job_status.find(
    (k: any) => k.value === checked,
  );
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    okType: 'danger',
    onCancel() {},
    onOk() {
      handleChangeStatus({
        jobId: record.jobId,
        status: checked,
      });
    },
    title: createVNode('div', {}, [
      '是否改变任务状态为',
      createVNode('span', { class: 'color-danger' }, ` ${item?.label} `),
      '?',
    ]),
  });
};

// 改变用户状态
const handleChangeStatus = async (data: any) => {
  const { code, msg }: any = await changeCronJobStatus(data);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const afterChangeForm = (type: string) => {
  if (type === 'add') {
    current.value = 1;
  }
  getData();
};

// 导出
const handleExport = async () => {
  const data = await exportCronJob(getParams());
  if (data) {
    downloadFile(data, `定时任务_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

const handleJumpLog = (jobName: string) => {
  router.push({
    path: '/monitor/job/details',
    query: { searchValue: jobName },
  });
};

const onSearch = () => {
  current.value = 1;
  getData();
};

const getParams = () => {
  const params: any = {};
  if (searchValue.value && searchValue.value !== '') {
    params.jobName = searchValue.value;
  }
  if (jobGroup.value && jobGroup.value !== '') {
    params.jobGroup = jobGroup.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
  }
  return params;
};

// 获取表格数据
const getData = async () => {
  const params = getParams();
  loading.value = true;
  const {
    code,
    msg,
    rows,
    total: tableTotal,
  }: any = await getCronJobDataByPage({
    pageNum: current.value,
    pageSize: pageSize.value,
    ...params,
  });
  if (code === 200) {
    dataSource.value = rows;
    total.value = tableTotal;
    // 把全选制空
    selectedRowKeys.value = [];
    loading.value = false;
  } else {
    messageWithKey.error(msg);
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <AlphaTable>
    <template #search>
      <!-- 搜索 -->
      <Row :gutter="[16, 16]">
        <Col class="padding-8-0">
          <InlineLayout label="任务组名">
            <template #wrapper>
              <Select
                v-model:value="jobGroup"
                :options="dictType.sys_job_group"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择任务组名"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="任务状态">
            <template #wrapper>
              <Select
                v-model:value="status"
                :options="dictType.sys_job_status"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择任务状态"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="关键词">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                placeholder="请输入任务名称"
                allow-clear
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <Button type="primary" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </template>
    <template #table>
      <AlphaTitle title="定时任务" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['monitor:job:add']"
            type="primary"
            @click="showTaskForm('add', '')"
          >
            新增任务
          </Button>
          <Button
            v-if="selectedRowKeys.length > 0"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['monitor:job:export']"
            type="primary"
            @click="handleExport"
          >
            导出
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        row-key="jobId"
        :loading="loading"
        :data-source="dataSource"
        :columns="columns"
        :row-selection="rowSelection"
        :pagination="pagination"
        :scroll="{
          y: 'calc(100vh - 106px - 144px - 48px - 33px - 24px - 64px - 24px)',
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operate'">
            <Button
              v-hasPermi="['monitor:job:edit']"
              type="link"
              class="padding-4"
              @click="showTaskForm('edit', record)"
            >
              编辑
            </Button>
            <Popconfirm
              v-hasPermi="['monitor:job:changeStatus']"
              title="是否执行一次该任务?"
              ok-text="是"
              cancel-text="否"
              @confirm="confirmExecute(record)"
              @cancel="cancel"
            >
              <Button
                v-hasPermi="['monitor:job:changeStatus']"
                type="link"
                danger
                class="padding-4"
              >
                执行一次
              </Button>
            </Popconfirm>
            <Popconfirm
              v-hasPermi="['monitor:job:remove']"
              title="是否删除该任务?"
              ok-text="是"
              cancel-text="否"
              @confirm="confirmTask(record.jobId)"
              @cancel="cancel"
            >
              <Button
                v-hasPermi="['monitor:job:remove']"
                type="link"
                danger
                class="padding-4"
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              v-hasPermi="['monitor:job:query']"
              type="link"
              class="padding-4"
              @click="handleJumpLog(record.jobName)"
            >
              调度日志
            </Button>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Switch
              :checked="text"
              :checked-value="STATUS_DEFAULT_NORMAL"
              :un-checked-value="STATUS_DEFAULT_STOP"
              @change="(checked: any) => showConfirm(checked, record)"
            />
          </template>
          <template v-else-if="column.dataIndex === 'jobGroup'">
            <Tag
              :color="showOptionsOfAttr(text, dictType.sys_job_group, 'color')"
            >
              {{ showOptionsOfAttr(text, dictType.sys_job_group, 'label') }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'cronText'">
            {{ cronstrue.toString(record.cronExpression, { locale: 'zh_CN' }) }}
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <CronJobForm ref="refTaskForm" :after-save="afterChangeForm" />
</template>
