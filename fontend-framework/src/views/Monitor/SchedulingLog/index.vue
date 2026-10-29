<script setup lang="ts" name="SchedulingLog">
import type { Dayjs } from 'dayjs';

import { computed, createVNode, onMounted, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Col,
  Input,
  Modal,
  RangePicker,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import {
  cleanJobLogData,
  deleteJobLogData,
  exportJobLogData,
  getJobLogDataByPage,
} from '/@/api/jobLog';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

const route = useRoute();
const { dictType } = useDictType(['sys_job_group', 'sys_job_status']);

const status = ref<string>();
const timeGroup = ref<[Dayjs, Dayjs]>();
const jobGroup = ref<string>();
const searchValue = ref<string>('');

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
    dataIndex: 'jobMessage',
    ellipsis: true,
    title: '日志信息',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '执行状态',
  },
  {
    dataIndex: 'createTime',
    ellipsis: true,
    title: '执行时间',
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

const selectedRowKeys = ref<string[]>([]);

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

// 删除日志
const deleteUserApi = async (id: string) => {
  const { code, msg }: any = await deleteJobLogData(id);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 批量删除 日志
const showDeleteConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    // content: 'Some descriptions',
    okType: 'danger',
    onCancel() {},
    onOk() {
      deleteUserApi(selectedRowKeys.value.join(','));
    },
    title: '是否删除选中日志?',
  });
};

// 清空
const handleClean = async () => {
  const { code, msg }: any = await cleanJobLogData();
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 导出
const handleExport = async () => {
  const data = await exportJobLogData(getParams());
  if (data) {
    downloadFile(data, `日志_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

const onSearch = () => {
  current.value = 1;
  getData();
};

const getParams = () => {
  const params: any = {};
  if (timeGroup.value && timeGroup.value.length > 0) {
    params.params.beginTime = timeGroup.value[0];
    params.params.endTime = timeGroup.value[1];
  }
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
  }: any = await getJobLogDataByPage({
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
  if (route.query) {
    searchValue.value = route.query.searchValue as string;
  }
  getData();
});
</script>

<template>
  <AlphaTable>
    <template #search>
      <!-- 搜索 -->
      <Row :gutter="[16, 16]">
        <Col class="padding-8-0">
          <InlineLayout label="执行时间">
            <template #wrapper>
              <RangePicker
                v-model:value="timeGroup"
                value-format="YYYY-MM-DD"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
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
      <AlphaTitle title="调度日志" class="margin-bottom-24">
        <Space>
          <Button
            v-if="selectedRowKeys.length > 0"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button type="primary" danger @click="handleClean">清空</Button>
          <Button type="primary" @click="handleExport">导出</Button>
        </Space>
      </AlphaTitle>
      <Table
        row-key="jobLogId"
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
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'status'">
            <Tag
              :color="showOptionsOfAttr(text, dictType.sys_job_status, 'color')"
            >
              {{ showOptionsOfAttr(text, dictType.sys_job_status, 'label') }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'jobGroup'">
            <Tag
              :color="showOptionsOfAttr(text, dictType.sys_job_group, 'color')"
            >
              {{ showOptionsOfAttr(text, dictType.sys_job_group, 'label') }}
            </Tag>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
</template>
