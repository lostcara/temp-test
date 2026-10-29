<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Button, Image, Result } from 'ant-design-vue';

import NOT_FOUND_IMAGE from '/@/assets/img/404.png';

const router = useRouter();

const handleBack = () => {
  router.replace('/');
};
</script>

<template>
  <div class="not-found-container">
    <Result sub-title="抱歉，当前访问的页面不存在。">
      <template #icon>
        <Image :src="NOT_FOUND_IMAGE" :preview="false" />
      </template>
      <template #extra>
        <Button type="primary" @click="handleBack">返回主页</Button>
      </template>
    </Result>
  </div>
</template>

<style lang="scss">
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
