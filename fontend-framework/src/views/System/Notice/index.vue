<script setup lang="ts" name="Notice">
import { computed, createVNode, onMounted, ref, unref } from 'vue';

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
  Table,
  TablePaginationConfig,
  Tag,
} from 'ant-design-vue';

import NoticeForm from './NoticeForm.vue';

import { deleteNoticeData, getNoticeDataByPage } from '/@/api/notice';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { filterOption, showOptionsOfAttr } from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

const refModalForm = ref();
const searchValue = ref<string>('');
const createBy = ref<string>('');
const noticeType = ref<string>();

const loading = ref<boolean>(false);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const dataSource = ref<any[]>([]);
const selectedRowKeys = ref<string[]>([]);

const { dictType } = useDictType(['sys_notice_type', 'sys_notice_status']);

const columns = [
  {
    dataIndex: 'noticeTitle',
    ellipsis: true,
    title: '公告标题',
  },
  {
    dataIndex: 'noticeType',
    ellipsis: true,
    title: '公告类型',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '状态',
  },
  {
    dataIndex: 'createBy',
    ellipsis: true,
    title: '创建者',
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
  const { code, msg }: any = await deleteNoticeData(group.join(','));
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
    title: '是否批量删除公告?',
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

// 获取参数
const createConfig = () => {
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (searchValue.value && searchValue.value !== '') {
    params.noticeTitle = searchValue.value;
  }
  if (createBy.value && createBy.value !== '') {
    params.createBy = createBy.value;
  }
  if (noticeType.value && noticeType.value !== '') {
    params.noticeType = noticeType.value;
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
  }: any = await getNoticeDataByPage({
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
          <InlineLayout label="操作人员">
            <template #wrapper>
              <Input
                v-model:value.trim="createBy"
                allow-clear
                placeholder="请输入操作人员"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="类型">
            <template #wrapper>
              <Select
                v-model:value="noticeType"
                :options="dictType.sys_notice_type"
                show-search
                :filter-option="filterOption"
                class="w-216"
                placeholder="请选择类型"
                allow-clear
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="公告标题">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                allow-clear
                placeholder="请输入公告标题"
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
      <AlphaTitle title="通知公告" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:config:add']"
            type="primary"
            @click="handleShowModal('add', null)"
          >
            新增公告
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
        row-key="noticeId"
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
              title="是否删除该公告?"
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
          <template v-else-if="column.dataIndex === 'noticeType'">
            <Tag
              :color="
                showOptionsOfAttr(text, dictType.sys_notice_type, 'color')
              "
            >
              {{ showOptionsOfAttr(text, dictType.sys_notice_type, 'label') }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Tag
              :color="
                showOptionsOfAttr(text, dictType.sys_notice_status, 'color')
              "
            >
              {{ showOptionsOfAttr(text, dictType.sys_notice_status, 'label') }}
            </Tag>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <NoticeForm ref="refModalForm" :handle-effect="handleEffect" />
</template>
