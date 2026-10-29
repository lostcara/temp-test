<script setup lang="ts" name="Portrait">
import { onMounted, ref } from 'vue';

import { Button, Col, Input, Row, Space } from 'ant-design-vue';

import UserForm from './UserForm.vue';

import AlphaTable from '/@/components/AlphaTable/index.vue';

// 新增用户
const refUserForm = ref();

const phonenumber = ref<string>('');

// 表格
const loading = ref<boolean>(false);
const dataSource = ref<any[]>([]);
const current = ref<number>(1);

const originData = [
  {
    field1: '摄像头',
    field2: '1000001',
    field3: '感知类专用设备',
    field4: '停车场进出管理',
    field5: '查看',
    field6: '查看',
  },
];

const selectedRowKeys = ref<string[]>([]);

const afterChangeForm = (type: string) => {
  if (type === 'add') {
    current.value = 1;
  }
  getData();
};

const onSearch = () => {
  refUserForm.value.showModal();
  getData();
};
const reset = () => {
  phonenumber.value = '';
  getData();
};
// 获取表格数据
const getData = async () => {
  loading.value = true;
  setTimeout(() => {
    dataSource.value = originData;
    // 把全选制空
    selectedRowKeys.value = [];
    loading.value = false;
  }, 2000);
};

onMounted(() => {
  getData();
});
</script>

<template>
  <AlphaTable :search-flag="false">
    <template #table>
      <!-- 查询 -->
      <Row :gutter="[16, 16]">
        <Col class="padding-8-0">
          <InlineLayout label="标识编号">
            <template #wrapper>
              <Input
                v-model:value.trim="phonenumber"
                placeholder="请输入标识编号"
                class="w-216"
                @keydown.enter="onSearch"
              />
            </template>
          </InlineLayout>
        </Col>
        <Col class="padding-8-0">
          <Space>
            <Button type="primary" @click="onSearch">解析</Button>
            <Button @click="reset">重置</Button>
          </Space>
        </Col>
      </Row>
    </template>
  </AlphaTable>
  <UserForm ref="refUserForm" :after-save="afterChangeForm" />
</template>
