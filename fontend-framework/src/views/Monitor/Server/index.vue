<script setup lang="ts" name="Server">
import { onMounted, ref } from 'vue';

import {
  Card,
  Col,
  Descriptions,
  DescriptionsItem,
  Row,
  Table,
} from 'ant-design-vue';

import { getServerDataByPage } from '/@/api/server';
import { messageWithKey } from '/@/hooks/useMessageKey';

// 表格
const loading = ref<boolean>(true);
const cpuData = ref<any>();
const memData = ref<any>();
const jvmData = ref<any>();
const serverData = ref<any>();

const dataSource = ref([]);
const columns = [
  {
    dataIndex: 'dirName',
    ellipsis: true,
    key: 'dirName',
    title: '盘符路径',
  },
  {
    dataIndex: 'sysTypeName',
    ellipsis: true,
    key: 'sysTypeName',
    title: '文件系统',
  },
  {
    dataIndex: 'typeName',
    ellipsis: true,
    key: 'typeName',
    title: '盘符类型',
  },
  {
    dataIndex: 'total',
    ellipsis: true,
    key: 'total',
    title: '总大小',
  },
  {
    dataIndex: 'free',
    ellipsis: true,
    key: 'free',
    title: '可用大小',
  },
  {
    dataIndex: 'used',
    ellipsis: true,
    key: 'used',
    title: '已用大小',
  },
  {
    dataIndex: 'usage',
    ellipsis: true,
    key: 'usage',
    title: '已用百分比',
  },
];

// 获取表格数据
const getData = async () => {
  loading.value = true;
  const { code, data, msg }: any = await getServerDataByPage();
  if (code === 200) {
    cpuData.value = data.cpu;
    memData.value = data.mem;
    jvmData.value = data.jvm;
    serverData.value = data.sys;
    dataSource.value = data?.sysFiles || [];
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
  <Row :gutter="[16, 16]">
    <Col :span="12">
      <Card title="CPU" :loading="loading">
        <Descriptions bordered :column="1">
          <DescriptionsItem label="核心数">
            {{ cpuData?.cpuNum }}
          </DescriptionsItem>
          <DescriptionsItem label="用户使用率">
            {{ cpuData?.used }}%
          </DescriptionsItem>
          <DescriptionsItem label="系统使用率">
            {{ cpuData?.sys }}%
          </DescriptionsItem>
          <DescriptionsItem label="当前空闲率">
            {{ cpuData?.free }}%
          </DescriptionsItem>
        </Descriptions>
      </Card>
    </Col>
    <Col :span="12">
      <Card title="内存" :loading="loading">
        <Descriptions bordered :column="2">
          <DescriptionsItem label="总内存(内存)">
            {{ memData?.total }}G
          </DescriptionsItem>
          <DescriptionsItem label="已用内存(内存)">
            {{ memData?.used }}G
          </DescriptionsItem>
          <DescriptionsItem label="剩余内存(内存)">
            {{ memData?.free }}G
          </DescriptionsItem>
          <DescriptionsItem label="使用率(内存)">
            <span :class="memData?.usage > 80 ? 'color-danger' : ''">
              {{ memData?.usage }}%
            </span>
          </DescriptionsItem>
          <DescriptionsItem label="总内存(JVM)">
            {{ jvmData?.total }}M
          </DescriptionsItem>
          <DescriptionsItem label="已用内存(JVM)">
            {{ jvmData?.used }}M
          </DescriptionsItem>
          <DescriptionsItem label="剩余内存(JVM)">
            {{ jvmData?.free }}M
          </DescriptionsItem>
          <DescriptionsItem label="使用率(JVM)">
            <span :class="jvmData?.usage > 80 ? 'color-danger' : ''">
              {{ jvmData?.usage }}%
            </span>
          </DescriptionsItem>
        </Descriptions>
      </Card>
    </Col>
    <Col :span="24">
      <Card title="服务器信息" :loading="loading">
        <Descriptions bordered :column="2">
          <DescriptionsItem label="服务器名称">
            {{ serverData?.computerName }}
          </DescriptionsItem>
          <DescriptionsItem label="操作系统">
            {{ serverData?.osName }}
          </DescriptionsItem>
          <DescriptionsItem label="服务器IP">
            {{ serverData?.computerIp }}
          </DescriptionsItem>
          <DescriptionsItem label="系统架构">
            {{ serverData?.osArch }}
          </DescriptionsItem>
        </Descriptions>
      </Card>
    </Col>
    <Col :span="24">
      <Card title="Java虚拟机信息" :loading="loading">
        <Descriptions bordered :column="2">
          <DescriptionsItem label="Java名称">
            {{ jvmData?.name }}
          </DescriptionsItem>
          <DescriptionsItem label="Java版本">
            {{ jvmData?.version }}
          </DescriptionsItem>
          <DescriptionsItem label="启动时间">
            {{ jvmData?.startTime }}
          </DescriptionsItem>
          <DescriptionsItem label="运行时长">
            {{ jvmData?.runTime }}
          </DescriptionsItem>
          <DescriptionsItem label="安装路径" :span="3">
            {{ jvmData?.home }}
          </DescriptionsItem>
          <DescriptionsItem label="项目路径" :span="3">
            {{ serverData?.userDir }}
          </DescriptionsItem>
          <DescriptionsItem label="运行参数" :span="3">
            {{ jvmData?.inputArgs }}
          </DescriptionsItem>
        </Descriptions>
      </Card>
    </Col>
    <Col :span="24">
      <Card title="磁盘状态" :loading="loading">
        <Table :columns="columns" :data-source="dataSource" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'usage'">
              {{ record.usage }}%
            </template>
          </template>
        </Table>
      </Card>
    </Col>
  </Row>
</template>
