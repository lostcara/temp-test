<script setup lang="ts" name="Dictionary">
import type { Dayjs } from 'dayjs';

import { computed, createVNode, onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

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

import DictTypeForm from './DictTypeForm.vue';

import {
  deleteDictType,
  exportDictType,
  getDictTypePage,
  refreshDictTypeCache,
} from '/@/api/dict';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';
import { checkPermission } from '/@/utils/permission';

const router = useRouter();

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

const { dictType } = useDictType(['sys_normal_disable']);

const columns = [
  {
    dataIndex: 'dictName',
    ellipsis: true,
    title: '字典名称',
  },
  {
    dataIndex: 'dictType',
    ellipsis: true,
    title: '字典类型',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '状态',
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
  const { code, msg }: any = await deleteDictType(group.join(','));
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
    title: '是否批量删除字典?',
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
  const { code, msg }: any = await refreshDictTypeCache();
  if (code === 200) {
    messageWithKey.success(msg);
  } else {
    messageWithKey.error(msg);
  }
};

// 导出
const handleExport = async () => {
  const data = await exportDictType();
  if (data) {
    downloadFile(data, `字典_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 点击跳转对应的详情
const handleClickType = (record: any) => {
  router.push({
    path: '/system/dict/details',
    query: { dictId: record.dictId },
  });
};

// 获取参数
const createConfig = () => {
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (searchValue.value && searchValue.value !== '') {
    params.dictName = searchValue.value;
  }
  if (type.value && type.value !== '') {
    params.dictType = type.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
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
  }: any = await getDictTypePage({
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
          <InlineLayout label="字典类型">
            <template #wrapper>
              <Input
                v-model:value.trim="type"
                placeholder="请输入字典类型"
                allow-clear
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="状态">
            <template #wrapper>
              <Select
                v-model:value="status"
                :options="dictType.sys_normal_disable"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择状态"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="字典名称">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                allow-clear
                placeholder="请输入字典名称"
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
      <AlphaTitle title="字典管理" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:dict:add']"
            type="primary"
            @click="handleShowModal('add', null)"
          >
            新增字典
          </Button>
          <Button
            v-if="selectedRowKeys.length > 0"
            v-hasPermi="['system:dict:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['system:dict:remove']"
            type="primary"
            danger
            @click="handleRefreshCache"
          >
            刷新缓存
          </Button>
          <Button
            v-hasPermi="['system:dict:export']"
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
        row-key="dictId"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operation'">
            <Button
              v-hasPermi="['system:dict:edit']"
              type="link"
              pramary
              class="padding-0-4"
              @click="handleShowModal('edit', record)"
            >
              编辑
            </Button>
            <Popconfirm
              v-hasPermi="['system:dict:remove']"
              ok-text="确认"
              cancel-text="取消"
              title="是否删除该字典?"
              @confirm="confirmDelete([record.dictId])"
            >
              <Button
                v-hasPermi="['system:dict:remove']"
                type="link"
                danger
                class="padding-0-4"
              >
                删除
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Tag
              :color="
                showOptionsOfAttr(text, dictType.sys_normal_disable, 'color')
              "
            >
              {{
                showOptionsOfAttr(text, dictType.sys_normal_disable, 'label')
              }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'dictType'">
            <Button
              v-if="checkPermission(['system:dictDetails:list'])"
              type="link"
              class="padding-0-4"
              @click="handleClickType(record)"
            >
              {{ text }}
            </Button>
            <span v-else>{{ text }}</span>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <DictTypeForm ref="refModalForm" :handle-effect="handleEffect" />
</template>
