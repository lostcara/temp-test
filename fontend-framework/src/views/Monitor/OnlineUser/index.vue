<script setup lang="ts" name="OnlineUser">
import type { TableProps } from 'ant-design-vue';

import { computed, onMounted, ref } from 'vue';

import { Button, Col, Input, Popconfirm, Row, Table } from 'ant-design-vue';
import dayjs from 'dayjs';

import { forceUserLogout, getOnlineDataByPage } from '/@/api/online';
import AlphaTable from '/@/components/AlphaTable/index.vue';
import AlphaTitle from '/@/components/AlphaTitle/index.vue';
import InlineLayout from '/@/components/InlineLayout/index.vue';
import { messageWithKey } from '/@/hooks/useMessageKey';
import { PAGE_SIZE_OPTIONS } from '/@/utils/consts';

const ipaddr = ref<string>('');
const searchValue = ref<string>('');

const dataSource = ref([]);
const total = ref<number>(0);
const current = ref<number>(1);
const pageSize = ref<number>(10);
const loading = ref<boolean>(false);

const columns = [
  {
    dataIndex: 'tokenId',
    ellipsis: true,
    key: 'tokenId',
    title: '会话编号',
  },
  {
    dataIndex: 'userName',
    ellipsis: true,
    key: 'userName',
    title: '登录名称',
  },
  {
    dataIndex: 'deptName',
    ellipsis: true,
    key: 'deptName',
    title: '所属部门',
  },
  {
    dataIndex: 'ipaddr',
    ellipsis: true,
    key: 'ipaddr',
    title: '主机',
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
    dataIndex: 'loginTime',
    ellipsis: true,
    key: 'loginTime',
    title: '登录时间',
  },
  {
    dataIndex: 'operate',
    key: 'operate',
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

// 强推用户
const confirmForce = async (tokenId: string) => {
  const { code, msg }: any = await forceUserLogout(tokenId);
  if (code === 200) {
    messageWithKey.success(msg);
    getData();
  } else {
    messageWithKey.error(msg);
  }
};

const createParamsConfig = () => {
  const params: any = {
    pageNum: current.value,
    pageSize: pageSize.value,
  };
  if (ipaddr.value && ipaddr.value !== '') {
    params.ipaddr = ipaddr.value;
  }
  if (searchValue.value && searchValue.value !== '') {
    params.userName = searchValue.value;
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
  }: any = await getOnlineDataByPage({
    ...params,
  });
  if (code === 200) {
    dataSource.value = rows;
    total.value = tableTotal;
    loading.value = false;
  } else {
    messageWithKey.error(msg);
  }
};

const handleTableChange: TableProps<any>['onChange'] = (pag) => {
  current.value = pag.current as number;
  pageSize.value = pag.pageSize as number;
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
      <AlphaTitle title="在线用户" class="margin-bottom-24" />
      <Table
        row-key="tokenId"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :scroll="{
          y: 'calc(100vh - 106px - 96px - 16px - 48px - 33px - 24px - 64px - 24px - 36px)',
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'operate'">
            <Popconfirm
              v-hasPermi="['monitor:online:forceLogout']"
              ok-text="确认"
              cancel-text="取消"
              title="是否强推该用户?"
              @confirm="confirmForce(record.tokenId)"
            >
              <Button
                v-hasPermi="['monitor:online:forceLogout']"
                type="link"
                danger
                class="padding-0-4"
              >
                强退
              </Button>
            </Popconfirm>
          </template>
          <template v-else-if="column.dataIndex === 'loginTime'">
            {{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </template>
      </Table>
    </template>
  </AlphaTable>
</template>
