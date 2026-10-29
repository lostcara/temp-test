<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Badge, Card, Col, Row } from 'ant-design-vue';
import * as echarts from 'echarts';

const refBarCharts = ref();

const myChart = ref<any>();

const dataSource = [
  { color: '#5470c6', name: '维修中', precent: '2%', value: 2 },
  { color: '#91cc75', name: '异常', precent: '20%', value: 1 },
  { color: '#fac858', name: '正在运行', precent: '25%', value: 15 },
  { color: '#ee6666', name: '关联风险', precent: '29%', value: 2 },
];

const options = {
  series: [
    {
      avoidLabelOverlap: false,
      data: dataSource,
      emphasis: {
        label: {
          show: true,
        },
      },
      itemStyle: {
        borderColor: '#fff',
        borderRadius: 4,
        borderWidth: 2,
      },
      label: {
        position: 'center',
        show: false,
      },
      labelLine: {
        show: false,
      },
      name: '设备总数',
      radius: ['40%', '70%'],
      type: 'pie',
    },
  ],
  tooltip: {
    trigger: 'item',
  },
};

onMounted(() => {
  myChart.value = echarts.init(refBarCharts.value);

  options && myChart.value.setOption(options);
});
</script>

<template>
  <div class="alpha-content-card3">
    <Card title="设备状态" class="w-h-100">
      <template #extra><a href="#">查看详情</a></template>
      <div ref="refBarCharts" class="chart"></div>
      <Row :gutter="[16, 16]">
        <Col v-for="item in dataSource" :span="12" :key="item.name">
          <Badge :color="item.color">
            <template #text>
              <span
                style="display: inline-block; width: 80px; text-align: center"
              >
                {{ item.name }}
              </span>
              <span style="display: inline-block; width: 40px; color: #c8b2b2">
                {{ item.precent }}
              </span>
              <span>{{ item.value }}</span>
            </template>
          </Badge>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<style lang="scss">
.alpha-content-card3 {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;

  .chart {
    height: 260px;
  }
}
</style>
