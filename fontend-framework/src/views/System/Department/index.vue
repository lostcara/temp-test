<script setup lang="ts" name="Department">
import { onMounted, ref } from 'vue';

import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import DeptForm from './DeptForm.vue';

import { deleteDeptData, getDeptDataByPage } from '/@/api/dept';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  changeAryToTreeAry,
  filterOption,
  showOptionsOfAttr,
} from '/@/utils/common';

const refModalForm = ref();
const searchValue = ref<string>('');
const status = ref<string>();

const loading = ref<boolean>(false);
const dataSource = ref<any[]>([]);

const { dictType } = useDictType(['sys_normal_disable']);

const columns = [
  {
    dataIndex: 'deptName',
    ellipsis: true,
    title: '部门名称',
  },
  {
    dataIndex: 'orderNum',
    ellipsis: true,
    title: '排序',
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

const showDisabled = (parentId: string) => {
  return String(parentId) === '0';
};

const confirmDelete = (group: string[]) => {
  deleteApi(group);
};

// 单个删除
const deleteApi = async (group: string[]) => {
  const { code, msg }: any = await deleteDeptData(group.join(','));
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const handleShowModal = async (type: string, record?: any) => {
  refModalForm.value.showModal(type, record);
};

const handleEffect = () => {
  getData();
};

// 获取参数
const createConfig = () => {
  const params: any = {};
  if (searchValue.value && searchValue.value !== '') {
    params.deptName = searchValue.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
  }
  return params;
};

/**
 * 搜索
 */
const onSearch = () => {
  getData();
};

const getData = async () => {
  const params = createConfig();
  loading.value = true;
  const {
    code,
    data = [],
    msg,
  }: any = await getDeptDataByPage({
    ...params,
  });
  if (code === 200) {
    dataSource.value = changeAryToTreeAry(
      data.map((k: any) => ({ ...k, label: k.deptName, value: k.deptId })),
      'deptId',
      'parentId',
    );
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
          <InlineLayout label="部门名称">
            <template #wrapper>
              <Input
                v-model:value.trim="searchValue"
                allow-clear
                placeholder="请输入部门名称"
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
      <AlphaTitle title="部门管理" class="margin-bottom-24">
        <Space>
          <Button
            v-hasPermi="['system:dept:add']"
            type="primary"
            @click="handleShowModal('add', null)"
          >
            新增部门
          </Button>
        </Space>
      </AlphaTitle>
      <Table
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{
          y: 'calc(100vh - 106px - 144px - 48px - 33px - 24px - 64px - 24px - 48px)',
        }"
        row-key="deptId"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operation'">
            <Button
              v-hasPermi="['system:dept:add']"
              type="link"
              pramary
              class="padding-0-4"
              @click="handleShowModal('add', record)"
            >
              新增
            </Button>
            <Button
              v-hasPermi="['system:dept:edit']"
              type="link"
              pramary
              class="padding-0-4"
              @click="handleShowModal('edit', record)"
            >
              编辑
            </Button>
            <Popconfirm
              ok-text="确认"
              cancel-text="取消"
              title="是否删除该部门?"
              :disabled="showDisabled(record.parentId)"
              @confirm="confirmDelete([record.deptId])"
            >
              <Button
                v-hasPermi="['system:dept:remove']"
                type="link"
                danger
                :disabled="showDisabled(record.parentId)"
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
        </template>
      </Table>
    </template>
  </AlphaTable>
  <DeptForm
    ref="refModalForm"
    :dept-tree-options="dataSource"
    :handle-effect="handleEffect"
  />
</template>
