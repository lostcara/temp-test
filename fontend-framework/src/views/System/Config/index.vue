<script setup lang="ts" name="Config">
import type { Dayjs } from 'dayjs';

import { computed, createVNode, onMounted, ref, unref } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  RangePicker,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
} from 'ant-design-vue';

import ConfigForm from './ConfigForm.vue';

import {
  deleteConfig,
  exportConfigData,
  getConfigPage,
  refreshConfigCache,
} from '/@/api/config';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

const refModalForm = ref();
const timeGroup = ref<[Dayjs, Dayjs]>();
const searchValue = ref<string>('');
const type = ref<string>('');
const status = ref<string>();

const loading = ref<boolean>(false);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const dataSource = ref<any[]>([]);
const selectedRowKeys = ref<string[]>([]);

const { dictType } = useDictType(['sys_yes_no']);

const columns = [
  {
    dataIndex: 'configName',
    ellipsis: true,
    title: '参数名称',
  },
  {
    dataIndex: 'configKey',
    ellipsis: true,
    title: '参数键名',
  },
  {
    dataIndex: 'configValue',
    ellipsis: true,
    title: '参数键值',
  },
  {
    dataIndex: 'configType',
    ellipsis: true,
    title: '系统内置',
  },
  {
    dataIndex: 'remark',
    ellipsis: true,
    title: '备注',
  },
  {
    dataIndex: 'createTime',
    ellipsis: true,
    title: '创建时间',
  },
  {
    dataIndex: 'operation',
    title: '操作',
  },
];

const rowSelection: any = computed(() => {
  return {
    onChange: onSelectChange,
    selectedRowKeys: unref(selectedRowKeys),
  };
});

const onSelectChange = (changableRowKeys: string[]) => {
  selectedRowKeys.value = changableRowKeys;
};

const confirmDelete = (group: string[]) => {
  deleteApi(group);
};

// 单个删除
const deleteApi = async (group: string[]) => {
  const { code, msg }: any = await deleteConfig(group.join(','));
  if (code === 200) {
    messageWithKey.success(msg);
    selectedRowKeys.value = [];
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 批量删除
const showDeleteConfirm = () => {
  Modal.confirm({
    cancelText: '取消',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'danger',
    onCancel() {},
    onOk() {
      confirmDelete(selectedRowKeys.value);
    },
    title: '是否批量删除参数?',
  });
};

// 分页配置
const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: any) => `共${total}条`,
  total: total.value,
}));

const handleTableChange = (pag: TablePaginationConfig) => {
  pageSize.value = pag.pageSize as number;
  current.value = pag.current as number;
  getData();
};

const handleShowModal = async (type: string, record?: any) => {
  refModalForm.value.showModal(type, record);
};

const handleEffect = (type: string) => {
  if (type === 'add') {
    current.value = 1;
  }
  getData();
};

// 刷新缓存
const handleRefreshCache = async () => {
  const { code, msg }: any = await refreshConfigCache();
  if (code === 200) {
    messageWithKey.success(msg);
  } else {
    messageWithKey.error(msg);
  }
};

// 导出
const handleExport = async () => {
  const data = await exportConfigData();
  if (data) {
    downloadFile(data, `参数_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 获取参数
const createConfig = () => {
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (searchValue.value && searchValue.value !== '') {
    params.configName = searchValue.value;
  }
  if (type.value && type.value !== '') {
    params.configKey = type.value;
  }
  if (status.value && status.value !== '') {
    params.configType = status.value;
  }
  if (timeGroup.value && timeGroup.value.length > 0) {
    params.params.beginTime = timeGroup.value[0];
    params.params.endTime = timeGroup.value[1];
  }
  return params;
};

/**
 * 搜索
 */
const onSearch = () => {
  current.value = 1;
  getData();
};

const getData = async () => {
  const params = createConfig();
  loading.value = true;
  const {
    code,
    msg,
    rows = [],
    total: tableTotal,
  }: any = await getConfigPage({
    ...params,
  });
  if (code === 200) {
    dataSource.value = rows;
    total.value = tableTotal;
    loading.value = false;
    selectedRowKeys.value = [];
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
          <InlineLayout label="创建时间">
            <template #wrapper>
              <RangePicker
                v-model:value="timeGroup"
                value-format="YYYY-MM-DD"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="参数键名">
            <template #wrapper>
              <Input
                v-model:value.trim="type"
                allow-clear
                placeholder="请输入参数键名"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="系统内置">
            <template #wrapper>
              <Select
                v-model:value="status"
                :options="dictType.sys_yes_no"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择系统内置"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="参数名称">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                allow-clear
                placeholder="请输入参数名称"
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
      <!-- 增删改 -->
      <AlphaTitle title="参数设置" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:config:add']"
            type="primary"
            @click="handleShowModal('add', null)"
          >
            新增参数
          </Button>
          <Button
            v-if="selectedRowKeys.length > 0"
            v-hasPermi="['system:config:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['system:config:remove']"
            type="primary"
            danger
            @click="handleRefreshCache"
          >
            刷新缓存
          </Button>
          <Button
            v-hasPermi="['system:config:export']"
            type="primary"
            @click="handleExport"
          >
            导出
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :scroll="{
          y: 'calc(100vh - 106px - 144px - 48px - 33px - 24px - 64px - 24px - 48px)',
        }"
        row-key="configId"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operation'">
            <Button
              v-hasPermi="['system:config:edit']"
              type="link"
              pramary
              class="padding-0-4"
              @click="handleShowModal('edit', record)"
            >
              编辑
            </Button>
            <Popconfirm
              v-hasPermi="['system:config:remove']"
              ok-text="确认"
              cancel-text="取消"
              title="是否删除该参数?"
              @confirm="confirmDelete([record.configId])"
            >
              <Button
                v-hasPermi="['system:config:remove']"
                type="link"
                danger
                class="padding-0-4"
              >
                删除
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'configType'">
            <Tag :color="showOptionsOfAttr(text, dictType.sys_yes_no, 'color')">
              {{ showOptionsOfAttr(text, dictType.sys_yes_no, 'label') }}
            </Tag>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <ConfigForm ref="refModalForm" :handle-effect="handleEffect" />
</template>
