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
  radar: {
    // shape: 'circle',
    indicator: [
      { max: 230, name: '资产重要性' },
      { max: 230, name: '数据重要性' },
      { max: 230, name: '网络重要性' },
      { max: 230, name: '业务重要性' },
    ],
  },
  series: [
    {
      data: [
        {
          name: '数据',
          value: [200, 200, 30, 180],
        },
      ],
      type: 'radar',
    },
  ],
};

onMounted(() => {
  myChart.value = echarts.init(refBarCharts.value);

  options && myChart.value.setOption(options);
});
</script>

<template>
  <div ref="refBarCharts" class="w-h-100"></div>
</template>
