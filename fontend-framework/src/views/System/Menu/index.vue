<script setup lang="ts" name="Menu">
import { onMounted, ref } from 'vue';

import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { MENU_TYPE_BTN } from './const';
import MenuForm from './MenuForm.vue';

import { deleteMenu, getMenuListByPage } from '/@/api/menu';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import { SvgIcon } from '/@/components/SvgIcon/index';
import useDictType from '/@/hooks/useDictType';
import { messageWithKey } from '/@/hooks/useMessageKey';
import {
  changeAryToTreeAry,
  filterOption,
  showOptionsOfAttr,
} from '/@/utils/common';

const { dictType } = useDictType(['sys_normal_disable']);

const columns = [
  {
    dataIndex: 'menuName',
    ellipsis: true,
    title: '菜单名称',
  },
  {
    dataIndex: 'icon',
    ellipsis: true,
    title: '图标',
  },
  {
    dataIndex: 'orderNum',
    ellipsis: true,
    title: '显示顺序',
  },
  {
    dataIndex: 'perms',
    ellipsis: true,
    title: '权限标识',
  },
  {
    dataIndex: 'component',
    ellipsis: true,
    title: '组件路径',
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

const modalRef = ref();

// 搜索名称
const menuName = ref<string>('');

const status = ref<string>();

const dataSource = ref<any[]>([]);

const menuTreeOptions = ref<any[]>([]);

const loading = ref<boolean>(false);

const onSearch = () => {
  getData();
};

const handleEffect = () => {
  getData();
};

const handleShowMenuForm = async (type: string, record: any) => {
  modalRef.value.showModal(type, record, menuTreeOptions.value);
};

const confirmDelete = (recordId: string) => {
  removeRecord(recordId);
};

const cancelDelete = () => {};

const removeRecord = async (recordId: string) => {
  const { code, msg }: any = await deleteMenu(recordId);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

/**
 * 生成 请求 配置
 */
const createConfig = () => {
  const params: any = {};
  if (menuName.value && menuName.value !== '') {
    params.menuName = menuName.value;
  }
  if (status.value && status.value !== '') {
    params.status = status.value;
  }
  return params;
};

const getData = async () => {
  const params = createConfig();
  loading.value = true;
  const { code, data, msg }: any = await getMenuListByPage(params);
  if (code === 200) {
    const group = data.filter((k: any) => k.menuType !== MENU_TYPE_BTN);
    const menus = group.map((k: any) => ({
      label: k.menuName,
      menuId: k.menuId,
      parentId: k.parentId,
      value: k.menuId,
    }));
    const menuTree = changeAryToTreeAry(menus, 'menuId', 'parentId');
    const list = changeAryToTreeAry(data, 'menuId', 'parentId');
    dataSource.value = list;
    menuTreeOptions.value = menuTree;
    loading.value = false;
  } else {
    messageWithKey.error(msg);
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
          <InlineLayout label="菜单名称">
            <template #wrapper>
              <Input
                v-model:value.trim="menuName"
                allow-clear
                placeholder="请输入菜单名称"
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
      <AlphaTitle title="菜单管理" class="margin-bottom-24">
        <Button
          v-hasPermi="['system:menu:add']"
          type="primary"
          @click="handleShowMenuForm('add', null)"
        >
          新增菜单
        </Button>
      </AlphaTitle>
      <Table
        :columns="columns"
        row-key="menuId"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{
          y: 'calc(100vh - 106px - 144px - 48px - 33px - 24px - 24px)',
        }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operation'">
            <Button
              v-hasPermi="['system:menu:edit']"
              type="link"
              class="padding-4"
              @click="handleShowMenuForm('edit', record)"
            >
              编辑
            </Button>
            <Button
              v-if="record.menuType !== MENU_TYPE_BTN"
              v-hasPermi="['system:menu:add']"
              type="link"
              class="padding-4"
              @click="handleShowMenuForm('add', record)"
            >
              新增
            </Button>
            <Popconfirm
              v-hasPermi="['system:menu:remove']"
              title="是否确认删除"
              ok-text="确认"
              cancel-text="取消"
              @confirm="confirmDelete(record.menuId)"
              @cancel="cancelDelete"
            >
              <Button
                v-hasPermi="['system:menu:remove']"
                type="link"
                danger
                class="padding-4"
              >
                删除
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'icon'">
            <SvgIcon v-if="text" :name="text" class="icon" />
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
  <MenuForm ref="modalRef" :handle-effect="handleEffect" />
</template>
