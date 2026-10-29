<script setup lang="ts" name="CacheKeyTable">
import { computed, ref, unref, watch } from 'vue';

import { Button, Popconfirm, Table } from 'ant-design-vue';

import { clearCacheKey, getCacheKeyList } from '/@/api/cache';
import { messageWithKey } from '/@/hooks/useMessageKey';

const props = defineProps({
  cacheName: {
    required: true,
    type: String,
  },
  handleDelete: {
    required: true,
    type: Function,
  },
  handleSelect: {
    required: true,
    type: Function,
  },
});

const columns = [
  {
    dataIndex: 'cacheLabel',
    ellipsis: true,
    key: 'cacheLabel',
    title: '缓存键名',
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: '操作',
  },
];

const loading = ref<boolean>(false);
const dataSource = ref<any>([]);
const selectedRowKeys = ref<string[]>([]);

const rowSelection: any = computed(() => {
  return {
    onChange: onSelectChange,
    selectedRowKeys: unref(selectedRowKeys),
    type: 'radio',
  };
});

const onSelectChange = (changableRowKeys: string[]) => {
  selectedRowKeys.value = changableRowKeys;
  if (props.handleSelect) {
    props.handleSelect(changableRowKeys);
  }
};

const confirm = async (name: string) => {
  const { code, msg }: any = await clearCacheKey(name);
  if (code === 200) {
    messageWithKey.success(msg);
    if (selectedRowKeys.value?.[0] === name && props.handleDelete) {
      props.handleDelete();
    }
    getCacheKeyData();
  } else {
    messageWithKey.error(msg);
  }
};

const cancel = () => {};

// 获取键名列表
const getCacheKeyData = async () => {
  if (props.cacheName) {
    loading.value = true;
    const { code, data, msg }: any = await getCacheKeyList(
      props.cacheName.replace(':', ''),
    );
    if (code === 200) {
      dataSource.value = data.map((k: any) => ({
        cacheKey: k,
        cacheLabel: k.replace(props.cacheName, ''),
      }));
      selectedRowKeys.value = [];
      loading.value = false;
    } else {
      messageWithKey.error(msg);
      loading.value = false;
    }
  }
};

const clearDataSource = () => {
  dataSource.value = [];
};

watch(
  () => props.cacheName,
  () => {
    getCacheKeyData();
  },
);

defineExpose({
  clearDataSource,
  getCacheKeyData,
});
</script>

<template>
  <Table
    row-key="cacheKey"
    :row-selection="rowSelection"
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
    :scroll="{
      y: 'calc(100vh - 106px - 144px - 48px)',
    }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <Popconfirm
          title="是否删除该缓存键名?"
          ok-text="是"
          cancel-text="否"
          @confirm="confirm(record.cacheKey)"
          @cancel="cancel"
        >
          <Button type="link" danger class="padding-4">删除</Button>
        </Popconfirm>
      </template>
    </template>
  </Table>
</template>
