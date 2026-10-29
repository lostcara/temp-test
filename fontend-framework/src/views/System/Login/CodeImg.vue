<script setup lang="ts" name="CodeImg">
import { Spin } from 'ant-design-vue';

defineProps({
  imgUrl: {
    required: true,
    type: String,
  },
  isFail: {
    default: false,
    type: Boolean,
  },
  loading: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(['clickCode']);

const handleClick = () => {
  emit('clickCode');
};
</script>

<template>
  <div class="code-img-container" @click="handleClick">
    <Spin v-if="loading" />
    <template v-else>
      <img v-if="!isFail" :src="imgUrl" alt="code" srcset="" />
      <div v-else>图片加载失败</div>
    </template>
  </div>
</template>

<style lang="scss">
.code-img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}
</style>
