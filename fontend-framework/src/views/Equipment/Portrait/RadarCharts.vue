<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import * as echarts from 'echarts';

interface Props {
  assetImportance?: number;
  dataImportance?: number;
  networkImportance?: number;
  businessImportance?: number;
}

const props = withDefaults(defineProps<Props>(), {
  assetImportance: 0,
  dataImportance: 0,
  networkImportance: 0,
  businessImportance: 0,
});

const refBarCharts = ref();

const myChart = ref<any>();

// 计算标题文本
const titleText = computed(() => {
  return `<资产重要性，相关，${props.assetImportance}>，\n<数据重要性，相关，${props.dataImportance}>，\n<网络重要性，相关，${props.networkImportance}>，\n<业务重要性，相关，${props.businessImportance}>`;
});

// 计算图表数据值
const chartValues = computed(() => {
  return [
    props.assetImportance ?? 0,
    props.dataImportance ?? 0,
    props.networkImportance ?? 0,
    props.businessImportance ?? 0,
  ];
});

// 图表配置
const options = computed(() => ({
  grid: {
    bottom: '2%',
    containLabel: true,
    left: '2%',
    right: '2%',
  },
  title: {
    text: titleText.value,
  },
  tooltip: {},
  radar: {
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
          name: '重要性数据',
          value: chartValues.value,
          label: {
            show: true,
            formatter: function (params: any) {
              return params.value;
            },
          },
        },
      ],
      type: 'radar',
    },
  ],
}));

// 更新图表
const updateChart = () => {
  if (myChart.value && refBarCharts.value) {
    myChart.value.setOption(options.value, true);
  }
};

// 监听数据变化，更新图表
watch(
  () => [
    props.assetImportance,
    props.dataImportance,
    props.networkImportance,
    props.businessImportance,
  ],
  () => {
    updateChart();
  },
  { deep: true },
);

// 窗口大小变化时调整图表大小
const handleResize = () => {
  if (myChart.value) {
    myChart.value.resize();
  }
};

onMounted(async () => {
  // 等待 DOM 完全渲染
  await nextTick();
  if (refBarCharts.value) {
    myChart.value = echarts.init(refBarCharts.value);
    updateChart();
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
  }
});

onBeforeUnmount(() => {
  // 移除事件监听器
  window.removeEventListener('resize', handleResize);
  // 销毁图表实例
  if (myChart.value) {
    myChart.value.dispose();
    myChart.value = null;
  }
});
</script>

<template>
  <div ref="refBarCharts" class="w-h-100"></div>
</template>
