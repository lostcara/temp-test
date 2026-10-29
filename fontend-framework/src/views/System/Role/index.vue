<script setup lang="ts" name="Role">
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
  Switch,
  Table,
  TablePaginationConfig,
} from 'ant-design-vue';

import DataAuthForm from './DataAuthForm.vue';
import RoleForm from './RoleForm.vue';

import {
  changeRoleStatus,
  deleteRole,
  exportRoleData,
  getRoleList,
  getRoleMenu,
} from '/@/api/role';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption } from '/@/utils/common';
import {
  PAGE_SIZE_OPTIONS,
  STATUS_DEFAULT_NORMAL,
  STATUS_DEFAULT_STOP,
} from '/@/utils/consts';

const refModalForm = ref();
const refDataAuthForm = ref();

const searchValue = ref<string>('');
const roleKey = ref<string>('');
const status = ref<string>();
const timeGroup = ref<[Dayjs, Dayjs]>();

const { dictType } = useDictType(['sys_normal_disable']);

const total = ref<number>(0);
const loading = ref<boolean>(false);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const dataSource = ref<any[]>([]);
const selectedRowKeys = ref<string[]>([]);

const columns = [
  {
    dataIndex: 'roleName',
    ellipsis: true,
    title: '角色名称',
  },
  {
    dataIndex: 'roleKey',
    ellipsis: true,
    title: '权限字符',
  },
  {
    dataIndex: 'roleSort',
    ellipsis: true,
    title: '显示顺序',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '状态',
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

// 是否禁用table行
const showDisabled = (roleId: string) => {
  if (String(roleId) === '1') {
    return true;
  }
  return false;
};

const rowSelection: any = computed(() => {
  return {
    getCheckboxProps: (record: any) => ({
      disabled: showDisabled(record.roleId), // Column configuration not to be checked
    }),
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
  const { code, msg }: any = await deleteRole(group);
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
    title: '是否批量删除角色?',
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

const handleShowModal = async (type: string, record: any) => {
  if (type === 'add') {
    refModalForm.value.showModal(type, record);
  } else {
    const { code, data, msg }: any = await getRoleMenu(record.roleId);
    if (code === 200) {
      record.menuIds = data;
      refModalForm.value.showModal(type, record);
    } else {
      messageWithKey.error(msg);
    }
  }
};

// 展示 数据权限 弹窗
const handleShowAuthModal = async (record: any) => {
  const { code, data, msg }: any = await getRoleMenu(record.roleId);
  if (code === 200) {
    refDataAuthForm.value.showModal(data);
  } else {
    messageWithKey.error(msg);
  }
};

const handleEffect = (type: string) => {
  if (type === 'add') {
    current.value = 1;
  }
  getData();
};

// 展示弹框 改变角色状态
const showConfirm = (checked: string, record: any) => {
  const item = dictType.value.sys_normal_disable.find(
    (k: any) => k.value === checked,
  );
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    okType: 'danger',
    onCancel() {},
    onOk() {
      handleChangeStatus({
        roleId: record.roleId,
        status: checked,
      });
    },
    title: createVNode('div', {}, [
      '是否改变角色状态为',
      createVNode('span', { class: 'color-danger' }, ` ${item?.label} `),
      '?',
    ]),
  });
};

// 改变角色状态
const handleChangeStatus = async (data: any) => {
  const { code, msg }: any = await changeRoleStatus(data);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

// 导出
const handleExport = async () => {
  const data = await exportRoleData();
  if (data) {
    downloadFile(data, `角色_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 获取角色名称参数
const createConfig = () => {
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (searchValue.value && searchValue.value !== '') {
    params.roleName = searchValue.value;
  }
  if (roleKey.value && roleKey.value !== '') {
    params.roleKey = roleKey.value;
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
  getData();
};

// 获取角色列表
const getData = async () => {
  const params = createConfig();
  loading.value = true;
  const {
    code,
    msg,
    rows = [],
    total: tableTotal,
  }: any = await getRoleList({
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
          <InlineLayout label="权限字符">
            <template #wrapper>
              <Input
                v-model:value.trim="roleKey"
                allow-clear
                placeholder="请输入权限字符"
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
          <InlineLayout label="角色名称">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                allow-clear
                placeholder="请输入角色名称"
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
      <AlphaTitle title="角色管理" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:role:add']"
            type="primary"
            @click="handleShowModal('add', null)"
          >
            新增角色
          </Button>
          <Button
            v-show="selectedRowKeys.length > 0"
            v-hasPermi="['system:role:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <Button
            v-hasPermi="['system:role:export']"
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
          y: 'calc(100vh - 106px - 144px - 48px - 33px - 24px - 64px - 24px)',
        }"
        row-key="roleId"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operation'">
            <Button
              v-hasPermi="['system:role:edit']"
              type="link"
              pramary
              :disabled="showDisabled(record.roleId)"
              class="padding-0-4"
              @click="handleShowModal('edit', record)"
            >
              编辑
            </Button>
            <Popconfirm
              v-hasPermi="['system:role:remove']"
              ok-text="确认"
              cancel-text="取消"
              title="是否删除该角色?"
              :disabled="showDisabled(record.roleId)"
              @confirm="confirmDelete([record.roleId])"
            >
              <Button
                v-hasPermi="['system:role:remove']"
                type="link"
                danger
                :disabled="showDisabled(record.roleId)"
                class="padding-0-4"
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              v-hasPermi="['system:role:edit']"
              type="link"
              pramary
              :disabled="showDisabled(record.roleId)"
              class="padding-0-4"
              @click="handleShowAuthModal(record)"
            >
              数据权限
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
        </template>
      </Table>
    </template>
  </AlphaTable>
  <RoleForm ref="refModalForm" :handle-effect="handleEffect" />
  <DataAuthForm ref="refDataAuthForm" />
</template>
