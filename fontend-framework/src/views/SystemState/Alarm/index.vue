<!-- 告警信息 -->
<script setup lang="ts" name="Alarm">
import { computed, createVNode, onMounted, ref, unref } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from 'ant-design-vue';
import type { TablePaginationConfig } from 'ant-design-vue';

import UserForm from './UserForm.vue';

import AlphaTable from '/@/components/AlphaTable/index.vue';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  filterOption,
  showOptionsOfAttr,
  exportToExcel,
} from '/@/utils/common';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';
import {
  fetchAlarmInfoList,
  importAlarmInfoData,
  batchDeleteAlarmInfos,
} from '/@/api/alarmInfo';

// 新增用户
const refUserForm = ref();

const status = ref<string | undefined>();
const statusOptions = [
  {
    color: '#F04438',
    label: '待查',
    value: 'pending',
  },
  {
    color: '#52C41A',
    label: '已修复',
    value: 'resolved',
  },
];
const alarmNumberKeyword = ref<string>('');
const deviceNameKeyword = ref<string>('');

// 表格
const loading = ref<boolean>(false);
const dataSource = ref<any[]>([]);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const columns = [
  {
    dataIndex: 'alarmNumber',
    ellipsis: true,
    title: '异常告警单号',
  },
  {
    dataIndex: 'businessName',
    ellipsis: true,
    title: '涉及业务名称',
  },
  {
    dataIndex: 'deviceName',
    ellipsis: true,
    title: '设备名称',
  },
  {
    dataIndex: 'deviceType',
    ellipsis: true,
    title: '设备类型',
  },
  {
    dataIndex: 'deviceModel',
    ellipsis: true,
    title: '设备型号',
  },
  {
    dataIndex: 'anomalyType',
    ellipsis: true,
    title: '异常类型',
  },
  {
    dataIndex: 'riskLevel',
    ellipsis: true,
    title: '风险级别',
  },
  {
    dataIndex: 'alarmTime',
    ellipsis: true,
    title: '告警时间',
  },
  {
    dataIndex: 'status',
    ellipsis: true,
    title: '状态',
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

const handleTableChange = (pagination: TablePaginationConfig) => {
  pageSize.value = pagination.pageSize ?? pageSize.value;
  current.value = pagination.current ?? current.value;
  getData();
};

const buildQueryParams = () => {
  const params: Record<string, string | number> = {};

  // 只添加有值的参数，避免传递 undefined 或空字符串
  if (alarmNumberKeyword.value?.trim()) {
    params.alarmNumber = alarmNumberKeyword.value.trim();
  }
  if (deviceNameKeyword.value?.trim()) {
    params.deviceName = deviceNameKeyword.value.trim();
  }
  if (status.value) {
    params.status = status.value;
  }

  // page 和 pageSize 始终传递（后端需要）
  params.page = current.value;
  params.pageSize = pageSize.value;

  return params;
};

// 显示 用户表单
const showUserForm = (type: string, record: any) => {
  refUserForm.value.showModal(type, record);
};

// 批量删除告警信息
const showDeleteConfirm = () => {
  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    okType: 'danger',
    onCancel() {},
    async onOk() {
      try {
        loading.value = true;
        const { code, message: msg }: any = await batchDeleteAlarmInfos(
          selectedRowKeys.value,
        );
        if (code === 200) {
          messageWithKey.success('删除成功');
          getData();
        } else {
          messageWithKey.error(msg || '删除失败');
        }
      } catch (error: any) {
        console.error('删除告警信息失败', error);
        messageWithKey.error(error?.message || '删除告警信息失败');
      } finally {
        loading.value = false;
      }
    },
    title: '是否删除选中数据?',
  });
};

const afterChangeForm = (type: string) => {
  if (type === 'add') {
    current.value = 1;
  }
  getData();
};

const onSearch = () => {
  current.value = 1;
  getData();
};

const onReset = () => {
  alarmNumberKeyword.value = '';
  deviceNameKeyword.value = '';
  status.value = undefined;
  current.value = 1;
  getData();
};

// 导出数据为 Excel
const handleExport = () => {
  try {
    exportToExcel(dataSource.value, columns, '告警信息');
    messageWithKey.success('导出成功');
  } catch (error: any) {
    console.error('导出失败', error);
    messageWithKey.error(error?.message || '导出失败');
  }
};

// 导入数据
const handleImport = async (file: File) => {
  try {
    loading.value = true;

    // 校验文件格式
    if (!file.name.endsWith('.json')) {
      messageWithKey.error('请上传 JSON 格式的文件');
      return false;
    }

    // 读取并校验 JSON 格式
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    let jsonData: any;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      messageWithKey.error('JSON 格式错误，请检查文件内容');
      return false;
    }

    // 校验数据格式（必须是数组）
    if (!Array.isArray(jsonData)) {
      messageWithKey.error('数据格式错误，期望数组格式');
      return false;
    }

    // 调用导入接口
    const { code, data, message: msg }: any = await importAlarmInfoData(file);
    if (code === 200) {
      const successMsg = `导入成功！新增 ${data.inserted || 0} 条，更新 ${data.updated || 0} 条`;
      if (data.errors && data.errors.length > 0) {
        const errorDetails = data.errors
          .map((err: any) => `${err.alarmNumber || '未知'}: ${err.error}`)
          .join('; ');
        messageWithKey.warning(`${successMsg}。错误数据：${errorDetails}`);
        console.warn('导入错误:', data.errors);
      } else {
        messageWithKey.success(successMsg);
      }
      current.value = 1;
      getData();
    } else {
      messageWithKey.error(msg || '导入失败');
    }
    return false; // 阻止默认上传行为
  } catch (error: any) {
    console.error('导入告警数据失败', error);
    messageWithKey.error(error?.message || '导入告警数据失败');
    return false;
  } finally {
    loading.value = false;
  }
};

// 获取表格数据
const getData = async () => {
  loading.value = true;
  try {
    const {
      code,
      data,
      message: msg,
    }: any = await fetchAlarmInfoList(buildQueryParams());
    if (code === 200) {
      const { list = [], pagination = {} } = data || {};
      dataSource.value = list;
      total.value = pagination.total ?? list.length;
      current.value = pagination.page ?? current.value;
      pageSize.value = pagination.pageSize ?? pageSize.value;
    } else {
      if (msg) {
        messageWithKey.error(msg);
      }
      dataSource.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    console.error('获取告警数据失败', error);
    // 提供更友好的错误提示
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      messageWithKey.error('请求超时，请检查后端服务是否正常运行');
    } else if (
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK'
    ) {
      messageWithKey.error(
        '网络连接失败，请确保后端服务已启动（http://localhost:3000）',
      );
    } else {
      messageWithKey.error(error?.message || '获取告警数据失败');
    }
    dataSource.value = [];
    total.value = 0;
  } finally {
    selectedRowKeys.value = [];
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
      <!-- 查询 -->
      <Row :gutter="[16, 16]">
        <Col class="padding-8-0">
          <InlineLayout label="告警单号">
            <template #wrapper>
              <Input
                v-model:value.trim="alarmNumberKeyword"
                placeholder="请输入告警单号"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <InlineLayout label="设备名称">
            <template #wrapper>
              <Input
                v-model:value.trim="deviceNameKeyword"
                placeholder="请输入设备名称"
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
                :options="statusOptions"
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
          <Space>
            <Button type="primary" @click="onSearch">查询</Button>
            <Button @click="onReset">重置</Button>
          </Space>
        </Col>
      </Row>
    </template>
    <template #table>
      <AlphaTitle title="告警信息" class="margin-bottom-24">
        <Space>
          <Upload
            :before-upload="handleImport"
            :show-upload-list="false"
            accept=".json"
          >
            <Button type="primary">导入数据</Button>
          </Upload>
          <Button type="primary" @click="handleExport">导出数据</Button>
          <Button
            :disabled="selectedRowKeys.length !== 1"
            @click="
              showUserForm(
                'edit',
                dataSource.find((item) => item.id === selectedRowKeys[0]),
              )
            "
          >
            编辑
          </Button>
          <Button
            :disabled="selectedRowKeys.length === 0"
            danger
            @click="showDeleteConfirm()"
          >
            删除
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        row-key="id"
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
        <template #bodyCell="{ column, text, record }">
          <!-- <template v-if="column.dataIndex === 'field5'">
            <Button type="link"> 查看 </Button>
          </template> -->
          <template v-if="column.dataIndex === 'alarmNumber'">
            <Button type="link">{{ text }}</Button>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag
              :color="
                record?.statusColor ||
                showOptionsOfAttr(text, statusOptions, 'color')
              "
            >
              {{
                record?.statusLabel ||
                showOptionsOfAttr(text, statusOptions, 'label') ||
                text
              }}
            </Tag>
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
  <UserForm ref="refUserForm" :after-save="afterChangeForm" />
</template>
