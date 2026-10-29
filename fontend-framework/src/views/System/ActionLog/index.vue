<script setup lang="ts" name="ActionLog">
import type { TableProps } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';

import { computed, createVNode, onMounted, ref, unref } from 'vue';

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

import ActionModal from './ActionModal.vue';

import {
  cleanOperlog,
  deleteOperlog,
  exportOperlog,
  getActionLogByPage,
} from '/@/api/systemlog';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

type RangeValue = [Dayjs, Dayjs];

const { dictType } = useDictType(['sys_oper_type', 'sys_common_status']);

const refModel = ref<any>();
const status = ref<string>();
const operIp = ref<string>('');
const title = ref<string>('');
const operName = ref<string>('');
const businessType = ref<string>();

const loading = ref<boolean>(false);
const timeGroup = ref<RangeValue>();
const dataSource = ref<any[]>([]);
const columns = [
  {
    dataIndex: 'title',
    ellipsis: true,
    title: '系统模块',
  },
  {
    dataIndex: 'businessType',
    ellipsis: true,
    title: '操作类型',
  },
  {
    dataIndex: 'operName',
    ellipsis: true,
    sorter: true,
    title: '操作人员',
  },
  {
    dataIndex: 'operIp',
    ellipsis: true,
    title: '操作地址',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '操作状态',
  },
  {
    dataIndex: 'operTime',
    ellipsis: true,
    sorter: true,
    title: '操作日期',
  },
  {
    dataIndex: 'costTime',
    ellipsis: true,
    sorter: true,
    title: '消耗时间',
  },
  {
    dataIndex: 'operate',
    title: '操作',
  },
];

const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const selectedRowKeys = ref<string[]>([]);
const sorter = ref<any[]>([]);

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

const handleTableChange: TableProps<any>['onChange'] = (pag, _, sort: any) => {
  current.value = pag.current as number;
  pageSize.value = pag.pageSize as number;
  sorter.value = sort.order
    ? [
        {
          field: sort.field,
          value: sort.order,
        },
      ]
    : [];
  getData();
};

const onSearch = () => {
  current.value = 1;
  getData();
};

const handleClickDetails = (record: any) => {
  refModel.value.showModal(record);
};

// 导出
const handleExport = async () => {
  const data = await exportOperlog();
  if (data) {
    downloadFile(data, `用户_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 删除记录
const deleteApi = async (id: string) => {
  const { code, msg }: any = await deleteOperlog(id);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 批量删除 记录
const showDeleteConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    // content: 'Some descriptions',
    okType: 'danger',
    onCancel() {},
    onOk() {
      deleteApi(selectedRowKeys.value.join(','));
    },
    title: '是否删除选中记录?',
  });
};

const confirmDelete = (id: string) => {
  deleteApi(id);
};

// 清空数据api
const cleanDataApi = async () => {
  const { code, msg }: any = await cleanOperlog();
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 清空数据
const showCleanConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    // content: 'Some descriptions',
    okType: 'danger',
    onCancel() {},
    onOk() {
      cleanDataApi();
    },
    title: '是否清空所有记录?',
  });
};

const createParamsConfig = () => {
  const params: any = {};
  if (businessType.value && businessType.value !== '') {
    params.businessType = businessType.value;
  }
  if (operName.value && operName.value !== '') {
    params.operName = operName.value;
  }
  if (title.value && title.value !== '') {
    params.title = title.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
  }
  if (operIp.value && operIp.value !== '') {
    params.operIp = operIp.value;
  }
  if (timeGroup.value && timeGroup.value.length > 0) {
    params.params.beginTime = timeGroup.value[0];
    params.params.endTime = timeGroup.value[1];
  }
  if (sorter.value && sorter.value.length > 0) {
    params.orderByColumn = sorter.value[0].field;
    params.isAsc = `${sorter.value[0].value}ing`;
  }
  return params;
};

const getData = async () => {
  const params = createParamsConfig();
  loading.value = true;
  const {
    code,
    msg,
    rows = [],
    total: tableTotal,
  }: any = await getActionLogByPage({
    pageNum: current.value,
    pageSize: pageSize.value,
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
      <Row :gutter="[16, 16]">
        <Col class="padding-8-0">
          <InlineLayout label="操作时间">
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
          <InlineLayout label="操作地址">
            <template #wrapper>
              <Input
                v-model:value.trim="operIp"
                placeholder="请输入操作地址"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="系统模块">
            <template #wrapper>
              <Input
                v-model:value.trim="title"
                placeholder="请输入系统模块"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="操作人员">
            <template #wrapper>
              <Input
                v-model:value.trim="operName"
                placeholder="请输入操作人员"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="操作类型">
            <template #wrapper>
              <Select
                v-model:value="businessType"
                :options="dictType.sys_oper_type"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择操作类型"
                allow-clear
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
                :options="dictType.sys_common_status"
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
          <Button type="primary" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </template>
    <template #table>
      <AlphaTitle title="操作日志" class="margin-bottom-24">
        <Space>
          <Button
            v-if="selectedRowKeys && selectedRowKeys.length > 0"
            v-hasPermi="['monitor:operlog:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['monitor:operlog:export']"
            type="primary"
            @click="handleExport"
          >
            导出
          </Button>
          <Button
            v-hasPermi="['monitor:operlog:remove']"
            type="primary"
            danger
            @click="showCleanConfirm"
          >
            清空
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        row-key="operId"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="pagination"
        :scroll="{
          y: 'calc(100vh - 106px - 96px - 16px - 48px - 33px - 24px - 64px - 24px - 36px)',
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operate'">
            <Button
              v-hasPermi="['monitor:operlog:query']"
              type="link"
              class="padding-4"
              @click="handleClickDetails(record)"
            >
              详细
            </Button>
            <Popconfirm
              v-hasPermi="['monitor:operlog:remove']"
              ok-text="确认"
              cancel-text="取消"
              title="是否删除该日志?"
              @confirm="confirmDelete(record.operId)"
            >
              <Button
                v-hasPermi="['monitor:operlog:remove']"
                type="link"
                danger
                class="padding-0-4"
              >
                删除
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'businessType'">
            <Tag
              :color="
                showOptionsOfAttr(String(text), dictType.sys_oper_type, 'color')
              "
            >
              {{
                showOptionsOfAttr(String(text), dictType.sys_oper_type, 'label')
              }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Tag
              :color="
                showOptionsOfAttr(
                  String(text),
                  dictType.sys_common_status,
                  'color',
                )
              "
            >
              {{
                showOptionsOfAttr(
                  String(text),
                  dictType.sys_common_status,
                  'label',
                )
              }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'costTime'">
            {{ `${text} 毫秒` }}
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <ActionModal ref="refModel" />
</template>
