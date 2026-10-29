<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import * as echarts from 'echarts';

const refBarCharts = ref();

const myChart = ref<any>();

const options = {
  grid: {
    bottom: '2%',
    containLabel: true,
    left: '2%',
    right: '2%',
  },
  series: [
    {
      data: [0.45, 0.14, 0.23, 0.8],
      name: '数据1',
      type: 'bar',
    },
    {
      data: [0.35, 0.11, 0.25, 0.8],
      name: '数据2',
      type: 'bar',
    },
  ],
  tooltip: {
    axisPointer: {
      type: 'shadow',
    },
    trigger: 'axis',
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    data: ['CPU使用率', '网络占用率', '内存占用率', '业务处理速度'],
    type: 'category',
  },
};

onMounted(() => {
  myChart.value = echarts.init(refBarCharts.value);

  options && myChart.value.setOption(options);
});
</script>

<template>
  <div ref="refBarCharts" class="w-h-100"></div>
</template>
