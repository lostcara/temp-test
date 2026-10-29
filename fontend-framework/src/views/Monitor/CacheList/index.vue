<script setup lang="ts" name="CacheList">
import { computed, h, onMounted, reactive, ref, unref } from 'vue';

import { RedoOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Col,
  Form,
  FormItem,
  Input,
  Popconfirm,
  Row,
  Table,
  Textarea,
} from 'ant-design-vue';

import CacheKeyTable from './CacheKeyTable.vue';

import {
  clearCacheAll,
  deleteCacheName,
  getCacheNameList,
  getCacheValueContent,
} from '/@/api/cache';
import { messageWithKey } from '/@/hooks/useMessageKey';

interface FormState {
  cacheKey: string;
  cacheName: string;
  cacheValue: string;
}

const refCacheKey = ref<any>();

const columns = [
  {
    dataIndex: 'cacheName',
    ellipsis: true,
    key: 'cacheName',
    title: '缓存名称',
  },
  {
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark',
    title: '备注',
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: '操作',
  },
];
const loading = ref<boolean>(true);
const dataSource = ref<any>([]);
const selectedRowKeys = ref<string[]>([]);
const selectedCacheKeys = ref<string[]>();
const formState = reactive<FormState>({
  cacheKey: '',
  cacheName: '',
  cacheValue: '',
});

const rowSelection: any = computed(() => {
  return {
    onChange: onSelectChange,
    selectedRowKeys: unref(selectedRowKeys),
    type: 'radio',
  };
});

const onSelectChange = (changableRowKeys: string[]) => {
  selectedRowKeys.value = changableRowKeys;
  refreshFormState();
};

const confirm = async (name: string) => {
  const { code, msg }: any = await deleteCacheName(name);
  if (code === 200) {
    messageWithKey.success(msg);
    if (selectedRowKeys.value?.[0] === name) {
      // 清空键名数据
      if (refCacheKey.value) {
        refCacheKey.value.clearDataSource();
      }
      selectedCacheKeys.value = [];
      refreshFormState();
    }
    getCacheNameData();
  } else {
    messageWithKey.error(msg);
  }
};

const cancel = () => {};

const handleChangeCacheKey = (selectKeys: string[]) => {
  selectedCacheKeys.value = selectKeys;
  refreshFormState();
  getCacheItemContent();
};

const handleAfterDelete = () => {
  refreshFormState();
};

// 获取缓存列表
const getCacheNameData = async () => {
  loading.value = true;
  const { code, data, msg }: any = await getCacheNameList();
  if (code === 200) {
    dataSource.value = data;
    selectedRowKeys.value = [];
    refreshFormState();
    loading.value = false;
  } else {
    messageWithKey.error(msg);
    loading.value = false;
  }
};

// 获取缓存内容
const getCacheItemContent = async () => {
  if (
    selectedRowKeys.value &&
    selectedRowKeys.value.length > 0 &&
    selectedCacheKeys.value &&
    selectedCacheKeys.value.length > 0
  ) {
    const { code, data, msg }: any = await getCacheValueContent(
      selectedRowKeys.value?.[0],
      selectedCacheKeys.value?.[0],
    );
    if (code === 200) {
      formState.cacheKey = data.cacheKey;
      formState.cacheName = data.cacheName;
      formState.cacheValue = data.cacheValue;
    } else {
      messageWithKey.error(msg);
    }
  }
};

const handleRefreshCacheName = () => {
  getCacheNameData();
};

const handleRefreshCacheKey = () => {
  if (refCacheKey.value) {
    refCacheKey.value.getCacheKeyData();
  }
};

const refreshFormState = () => {
  formState.cacheKey = '';
  formState.cacheName = '';
  formState.cacheValue = '';
};

const handleRefreshCacheContent = async () => {
  const { code, msg }: any = await clearCacheAll();
  if (code === 200) {
    messageWithKey.success(msg);
  } else {
    messageWithKey.error(msg);
  }
};

onMounted(() => {
  getCacheNameData();
});
</script>

<template>
  <Row :gutter="[16, 16]">
    <Col :span="8">
      <Card title="缓存列表">
        <template #extra>
          <Button
            type="link"
            :icon="h(RedoOutlined)"
            @click="handleRefreshCacheName"
          />
        </template>
        <Table
          row-key="cacheName"
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="false"
          :scroll="{
            y: 'calc(100vh - 106px - 144px - 48px)',
          }"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
              <Popconfirm
                title="是否删除该缓存名称?"
                ok-text="是"
                cancel-text="否"
                @confirm="confirm(record.cacheName)"
                @cancel="cancel"
              >
                <Button type="link" danger class="padding-4">删除</Button>
              </Popconfirm>
            </template>
            <template v-else-if="column.key === 'cacheName'">
              <span>{{ text.replace(':', '') }}</span>
            </template>
          </template>
        </Table>
      </Card>
    </Col>
    <Col :span="8">
      <Card title="键名列表">
        <template #extra>
          <Button
            type="link"
            :icon="h(RedoOutlined)"
            @click="handleRefreshCacheKey"
          />
        </template>
        <CacheKeyTable
          ref="refCacheKey"
          :cache-name="selectedRowKeys?.[0]"
          :handle-select="handleChangeCacheKey"
          :handle-delete="handleAfterDelete"
        />
      </Card>
    </Col>
    <Col :span="8">
      <Card title="缓存内容">
        <template #extra>
          <Button
            type="link"
            :icon="h(RedoOutlined)"
            @click="handleRefreshCacheContent"
          >
            清理全部
          </Button>
        </template>
        <Form
          :model="formState"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
          <FormItem label="缓存名称" name="cacheName">
            <Input v-model:value="formState.cacheName" disabled />
          </FormItem>

          <FormItem label="缓存键名" name="cacheKey">
            <Input v-model:value="formState.cacheKey" disabled />
          </FormItem>

          <FormItem label="缓存内容" name="cacheValue">
            <Textarea v-model:value="formState.cacheValue" disabled :rows="8" />
          </FormItem>
        </Form>
      </Card>
    </Col>
  </Row>
</template>
