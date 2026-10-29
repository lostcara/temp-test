<script setup lang="ts" name="LoginLog">
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

import {
  cleanLoginlog,
  deleteLoginlog,
  exportLoginlog,
  getLoginLogByPage,
  unlockLoginlog,
} from '/@/api/systemlog';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

type RangeValue = [Dayjs, Dayjs];

const { dictType } = useDictType(['sys_common_status']);

const timeGroup = ref<RangeValue>();
const ipaddr = ref<string>('');
const status = ref<string>();
const searchValue = ref<string>('');

const dataSource = ref([]);
const selectedRowKeys = ref<string[]>([]);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const loading = ref<boolean>(false);
const sorter = ref<any[]>([]);

const columns = [
  {
    dataIndex: 'userName',
    ellipsis: true,
    key: 'userName',
    sorter: true,
    title: '用户名称',
  },
  {
    dataIndex: 'ipaddr',
    ellipsis: true,
    key: 'ipaddr',
    title: '地址',
  },
  {
    dataIndex: 'loginLocation',
    ellipsis: true,
    key: 'loginLocation',
    title: '登录地点',
  },
  {
    dataIndex: 'os',
    ellipsis: true,
    key: 'os',
    title: '操作系统',
  },
  {
    dataIndex: 'browser',
    ellipsis: true,
    key: 'browser',
    title: '浏览器',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    key: 'status',
    title: '登录状态',
  },
  {
    dataIndex: 'msg',
    ellipsis: true,
    key: 'msg',
    title: '描述',
  },
  {
    dataIndex: 'loginTime',
    ellipsis: true,
    key: 'loginTime',
    sorter: true,
    title: '访问时间',
  },
  {
    dataIndex: 'operate',
    key: 'operate',
    title: '操作',
  },
];

const rowSelection: any = computed(() => {
  return {
    onChange: onSelectChange,
    selectedRowKeys: unref(selectedRowKeys),
  };
});

const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: any) => `共${total}条`,
  total: total.value,
}));

const onSelectChange = (changableRowKeys: string[]) => {
  selectedRowKeys.value = changableRowKeys;
};

// 导出
const handleExport = async () => {
  const data = await exportLoginlog();
  if (data) {
    downloadFile(data, `用户_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 解锁用户
const confirmUnlock = async (username: string) => {
  const { code, msg }: any = await unlockLoginlog(username);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 删除记录
const deleteApi = async (id: string) => {
  const { code, msg }: any = await deleteLoginlog(id);
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

// 清空数据api
const cleanDataApi = async () => {
  const { code, msg }: any = await cleanLoginlog();
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
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (timeGroup.value && timeGroup.value.length > 0) {
    params.params.beginTime = timeGroup.value[0];
    params.params.endTime = timeGroup.value[1];
  }
  if (ipaddr.value && ipaddr.value !== '') {
    params.ipaddr = ipaddr.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
  }
  if (searchValue.value && searchValue.value !== '') {
    params.userName = searchValue.value;
  }
  if (sorter.value && sorter.value.length > 0) {
    params.orderByColumn = sorter.value[0].field;
    params.isAsc = `${sorter.value[0].value}ing`;
  }
  return params;
};

// 获取表格数据
const getData = async () => {
  const params = createParamsConfig();
  loading.value = true;
  const {
    code,
    msg,
    rows = [],
    total: tableTotal,
  }: any = await getLoginLogByPage({
    ...params,
  });
  if (code === 200) {
    dataSource.value = rows;
    total.value = tableTotal;
    loading.value = false;
    selectedRowKeys.value = [];
  } else {
    messageWithKey.error(msg);
  }
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

onMounted(() => {
  getData();
});
</script>

<template>
  <AlphaTable>
    <template #search>
      <Row :gutter="[16, 0]">
        <Col class="padding-8-0">
          <InlineLayout label="登录时间">
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
          <InlineLayout label="登录地址">
            <template #wrapper>
              <Input
                v-model:value.trim="ipaddr"
                placeholder="请输入登录地址"
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
          <InlineLayout label="关键词">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                placeholder="请输入用户名称"
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
      <AlphaTitle title="登录日志" class="margin-bottom-24">
        <Space>
          <Button
            v-if="selectedRowKeys.length > 0"
            v-hasPermi="['monitor:logininfor:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['monitor:logininfor:export']"
            type="primary"
            @click="handleExport"
          >
            导出
          </Button>
          <Button
            v-hasPermi="['monitor:logininfor:remove']"
            type="primary"
            danger
            @click="showCleanConfirm"
          >
            清空
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        row-key="infoId"
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
            <Popconfirm
              v-hasPermi="['monitor:logininfor:unlock']"
              ok-text="确认"
              cancel-text="取消"
              title="是否解锁该用户?"
              @confirm="confirmUnlock(record.userName)"
            >
              <Button
                v-hasPermi="['monitor:logininfor:unlock']"
                type="link"
                class="padding-0-4"
              >
                解锁
              </Button>
            </Popconfirm>
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
        </template>
      </Table>
    </template>
  </AlphaTable>
</template>
