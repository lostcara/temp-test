<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue';

const props = defineProps({
  className: {
    default: '',
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  prefix: {
    default: 'icon',
    type: String,
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const svgClass = computed(() => `svg-icon ${props.className}`);
</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.1em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  fill: currentcolor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>
