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
  legend: {},
  series: [
    {
      data: [3, 2, 0, 2, 1, 0, 1],
      name: '异常告警',
      type: 'bar',
    },
    {
      data: [1, 2, 3, 0, 0, 1, 2],
      name: '新增风险',
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
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    type: 'category',
  },
  yAxis: {
    type: 'value',
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
