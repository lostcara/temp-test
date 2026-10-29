<script setup lang="ts" name="Cache">
import { onBeforeMount, onMounted, ref } from 'vue';

import { Card, Col, Descriptions, DescriptionsItem, Row } from 'ant-design-vue';
import * as echarts from 'echarts';

import { getCacheDetails } from '/@/api/cache';
import { messageWithKey } from '/@/hooks/useMessageKey';

const refCommand = ref<any>();
const refMemory = ref<any>();

const loading = ref<boolean>(true);
const basicData = ref<any>();
const commandChart = ref<any>();
const memoryChart = ref<any>();

const createCommandCharts = (data: any) => {
  commandChart.value = echarts.init(refCommand.value);
  const option = {
    series: [
      {
        center: ['50%', '50%'],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOffsetX: 0,
          },
        },
        name: '姓名',
        radius: [40, 120],
        type: 'pie',
      },
    ],
    tooltip: {
      formatter: '{a} <br/>{b} : {c} ({d}%)',
      trigger: 'item',
    },
  };
  option && commandChart.value.setOption(option);
};

const createMemoryCharts = (data: any) => {
  memoryChart.value = echarts.init(refMemory.value);
  const option = {
    series: [
      {
        data: [
          {
            name: '内存消耗',
            value: Number.parseFloat(data),
          },
        ],
        detail: {
          formatter: '{value}M',
          valueAnimation: true,
        },
        max: 1000,
        min: 0,
        name: '峰值',
        progress: {
          show: true,
        },
        type: 'gauge',
      },
    ],
    tooltip: {
      formatter: '{a} <br/>{b} : {c}M',
    },
  };
  option && memoryChart.value.setOption(option);
};

// 获取表格数据
const getData = async () => {
  loading.value = true;
  const { code, data, msg }: any = await getCacheDetails();
  if (code === 200) {
    basicData.value = {
      ...data.info,
      dbSize: data.dbSize,
    };
    if (refCommand.value) {
      createCommandCharts(data.commandStats);
      createMemoryCharts(data?.info?.used_memory_human);
    }
    loading.value = false;
  } else {
    messageWithKey.error(msg);
    loading.value = false;
  }
};

const resizeCharts = () => {
  if (commandChart.value) {
    commandChart.value.resize();
    memoryChart.value.resize();
  }
};

onMounted(() => {
  getData();
  window.addEventListener('resize', resizeCharts);
});

onBeforeMount(() => {
  window.removeEventListener('resize', resizeCharts);
});
</script>

<template>
  <Row :gutter="[16, 16]">
    <Col :span="24">
      <Card title="基本信息" :loading="loading">
        <Descriptions bordered :column="4">
          <DescriptionsItem label="Redis版本">
            {{ basicData?.redis_version }}
          </DescriptionsItem>
          <DescriptionsItem label="运行模式">
            {{ basicData?.redis_mode === 'standalone' ? '单机' : '集群' }}
          </DescriptionsItem>
          <DescriptionsItem label="端口">
            {{ basicData?.tcp_port }}
          </DescriptionsItem>
          <DescriptionsItem label="客户端数">
            {{ basicData?.connected_clients }}
          </DescriptionsItem>
          <DescriptionsItem label="运行时间(天)">
            {{ basicData?.uptime_in_days }}
          </DescriptionsItem>
          <DescriptionsItem label="使用内存">
            {{ basicData?.used_memory_human }}
          </DescriptionsItem>
          <DescriptionsItem label="使用CPU">
            {{ parseFloat(basicData?.used_cpu_user_children).toFixed(2) }}
          </DescriptionsItem>
          <DescriptionsItem label="内存配置">
            {{ basicData?.maxmemory_human }}
          </DescriptionsItem>
          <DescriptionsItem label="AOF是否开启">
            {{ basicData?.aof_enabled === '0' ? '否' : '是' }}
          </DescriptionsItem>
          <DescriptionsItem label="RDB是否成功">
            {{ basicData?.rdb_last_bgsave_status }}
          </DescriptionsItem>
          <DescriptionsItem label="Key数量">
            {{ basicData?.dbSize }}
          </DescriptionsItem>
          <DescriptionsItem label="网络入口/出口">
            {{ basicData.instantaneous_input_kbps }}kps/{{
              basicData.instantaneous_output_kbps
            }}kps
          </DescriptionsItem>
        </Descriptions>
      </Card>
    </Col>
    <Col :span="12">
      <Card title="命令统计">
        <div ref="refCommand" style="width: 100%; height: 500px"></div>
      </Card>
    </Col>
    <Col :span="12">
      <Card title="内存信息">
        <div ref="refMemory" style="width: 100%; height: 500px"></div>
      </Card>
    </Col>
  </Row>
</template>
