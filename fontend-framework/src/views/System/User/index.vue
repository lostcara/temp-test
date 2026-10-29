<script setup lang="ts" name="User">
import type { Dayjs } from 'dayjs';

import { computed, createVNode, onMounted, ref, unref } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Col,
  DropdownButton,
  Input,
  Menu,
  MenuItem,
  Modal,
  notification,
  Popconfirm,
  RangePicker,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TreeSelect,
  TypographyParagraph,
} from 'ant-design-vue';

import AssignRoleForm from './AssignRoleForm.vue';
import ImportModal from './ImportModal.vue';
import useDeptTreeOptions from './useDeptTreeOptions';
import UserForm from './UserForm.vue';

import {
  changeUserStatus,
  delUser,
  downloadUserXlsx,
  exportUserData,
  getUserList,
  resetPassword,
} from '/@/api/user';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { downloadFile, filterOption } from '/@/utils/common';
import {
  PAGE_SIZE_OPTIONS,
  STATUS_DEFAULT_NORMAL,
  STATUS_DEFAULT_STOP,
} from '/@/utils/consts';

const { dictType } = useDictType(['sys_normal_disable']);

// 新增用户
const refUserForm = ref();
// 分配角色
const refAssignRole = ref();
// 导入
const refImportModal = ref();

const { deptTreeOptions } = useDeptTreeOptions();

const status = ref<string>();
const deptId = ref<string>();
const timeGroup = ref<[Dayjs, Dayjs]>();
const phonenumber = ref<string>('');
const searchValue = ref<string>('');

// 表格
const loading = ref<boolean>(false);
const dataSource = ref([]);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const columns = [
  {
    dataIndex: 'userName',
    ellipsis: true,
    title: '用户名称',
  },
  {
    dataIndex: 'nickName',
    ellipsis: true,
    title: '用户昵称',
  },
  {
    dataIndex: 'deptName',
    ellipsis: true,
    title: '部门',
  },
  {
    dataIndex: 'phonenumber',
    ellipsis: true,
    title: '手机号码',
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

const selectedRowKeys = ref<string[]>([]);

// 是否禁用table行
const showDisabled = (flag: boolean) => {
  return flag;
};

const rowSelection: any = computed(() => {
  return {
    getCheckboxProps: (record: any) => ({
      disabled: showDisabled(record.admin), // Column configuration not to be checked
    }),
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

// 显示 用户表单
const showUserForm = (type: string, record: any) => {
  refUserForm.value.showModal(type, record);
};

// 显示 分配角色
const showAssignRoleForm = (record: any) => {
  refAssignRole.value.showModal(record);
};

// 删除用户
const deleteUserApi = async (id: string) => {
  const { code, msg }: any = await delUser(id);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const confirmUser = async (userId: string) => {
  deleteUserApi(userId);
};

// 批量删除 用户
const showDeleteConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    // content: 'Some descriptions',
    okType: 'danger',
    onCancel() {},
    onOk() {
      deleteUserApi(selectedRowKeys.value.join(','));
    },
    title: '是否删除选中用户?',
  });
};

// 重置密码
const confirmReset = async (record: any) => {
  const password = 'dqalpha@123';
  const { code, msg }: any = await resetPassword({
    password,
    userId: record.userId,
  });
  if (code === 200) {
    notification.open({
      description: createVNode(
        TypographyParagraph,
        {
          copyable: {
            text: `${password}`,
          },
        },
        { default: () => `${record.userName}的新密码为${password}` },
      ),
      duration: 0,
      message: '用户密码重置成功',
    });
  } else {
    messageWithKey.error(msg);
  }
};

const cancelUser = () => {};

// 展示弹框 改变用户状态
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
        status: checked,
        userId: record.userId,
      });
    },
    title: createVNode('div', {}, [
      '是否改变用户状态为',
      createVNode('span', { class: 'color-danger' }, ` ${item?.label} `),
      '?',
    ]),
  });
};

// 改变用户状态
const handleChangeStatus = async (data: any) => {
  const { code, msg }: any = await changeUserStatus(data);
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

// 导入用户
const handleImport = () => {
  refImportModal.value.showModal();
};

// 导出
const handleExport = async () => {
  const data = await exportUserData();
  if (data) {
    downloadFile(data, `用户_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('导出异常！');
  }
};

// 下载模板
const handleDownload = async () => {
  const data = await downloadUserXlsx();
  if (data) {
    downloadFile(data, `用户模板_${Date.now()}.xlsx`);
  } else {
    messageWithKey.error('模板导出异常！');
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
    params.userName = searchValue.value;
  }
  if (deptId.value && deptId.value !== '') {
    params.deptId = deptId.value;
  }
  if (phonenumber.value && phonenumber.value !== '') {
    params.phonenumber = phonenumber.value;
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
  }: any = await getUserList({
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
          <InlineLayout label="创建时间">
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
          <InlineLayout label="部门">
            <template #wrapper>
              <TreeSelect
                v-model:value="deptId"
                show-search
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择部门"
                allow-clear
                tree-default-expand-all
                :tree-data="deptTreeOptions"
                tree-node-filter-prop="label"
                :field-names="{
                  children: 'children',
                  label: 'label',
                  value: 'id',
                }"
                class="w-216"
                @keydown.enter="onSearch"
              >
                <template #title="{ label }">
                  {{ label }}
                </template>
              </TreeSelect>
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="手机号码">
            <template #wrapper>
              <Input
                v-model:value.trim="phonenumber"
                placeholder="请输入手机号码"
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
          <InlineLayout label="关键词">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
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
      <AlphaTitle title="用户管理" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:user:add']"
            type="primary"
            @click="showUserForm('add', '')"
          >
            新增用户
          </Button>
          <!-- <Button
            v-if="selectedRowKeys.length > 0"
            type="primary"
            @click="showAssignRoleForm('multiple', selectedRowKeys)"
          >
            批量分配角色
          </Button> -->
          <Button
            v-if="selectedRowKeys.length > 0"
            v-hasPermi="['system:user:remove']"
            type="primary"
            danger
            @click="showDeleteConfirm"
          >
            批量删除
          </Button>
          <DropdownButton type="primary">
            <template #overlay>
              <Menu>
                <MenuItem
                  key="1"
                  v-hasPermi="['system:user:import']"
                  @click="handleImport"
                >
                  导入
                </MenuItem>
                <MenuItem
                  key="2"
                  v-hasPermi="['system:user:export']"
                  @click="handleExport"
                >
                  导出
                </MenuItem>
                <MenuItem key="3" @click="handleDownload">下载模板</MenuItem>
              </Menu>
            </template>
            更多
          </DropdownButton>
        </Space>
      </AlphaTitle>
      <Table
        row-key="userId"
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
              v-hasPermi="['system:user:edit']"
              type="link"
              :disabled="showDisabled(record.admin)"
              class="padding-4"
              @click="showUserForm('edit', record)"
            >
              编辑
            </Button>
            <Button
              v-hasPermi="['system:user:edit']"
              type="link"
              :disabled="showDisabled(record.admin)"
              class="padding-4"
              @click="showAssignRoleForm(record)"
            >
              分配角色
            </Button>
            <Popconfirm
              v-hasPermi="['system:user:resetPwd']"
              title="是否重置密码?"
              ok-text="是"
              cancel-text="否"
              :disabled="showDisabled(record.admin)"
              @confirm="confirmReset(record)"
              @cancel="cancelUser"
            >
              <Button
                v-hasPermi="['system:user:resetPwd']"
                type="link"
                danger
                :disabled="showDisabled(record.admin)"
                class="padding-4"
              >
                重置密码
              </Button>
            </Popconfirm>
            <Popconfirm
              v-hasPermi="['system:user:remove']"
              title="是否删除该用户?"
              ok-text="是"
              cancel-text="否"
              :disabled="showDisabled(record.admin)"
              @confirm="confirmUser(record.userId)"
              @cancel="cancelUser"
            >
              <Button
                v-hasPermi="['system:user:remove']"
                type="link"
                danger
                :disabled="showDisabled(record.admin)"
                class="padding-4"
              >
                删除
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Switch
              :checked="text"
              :checked-value="STATUS_DEFAULT_NORMAL"
              :un-checked-value="STATUS_DEFAULT_STOP"
              :disabled="showDisabled(record.admin)"
              @change="(checked: any) => showConfirm(checked, record)"
            />
          </template>
          <template v-else-if="column.dataIndex === 'deptName'">
            <span>{{ record?.dept?.deptName }}</span>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <UserForm ref="refUserForm" :after-save="afterChangeForm" />
  <AssignRoleForm ref="refAssignRole" :after-save="getData" />
  <ImportModal ref="refImportModal" :after-save="onSearch" />
</template>
