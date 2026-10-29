<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Button, Image, Result } from 'ant-design-vue';

import NO_PERMISSION from '/@/assets/img/no-permission.png';

const router = useRouter();

const handleToLogin = () => {
  router.replace('/login');
};
</script>

<template>
  <div class="not-found-container">
    <Result
      status="warning"
      sub-title="抱歉，当前账号没有此页面的访问权限，请联系管理员！"
    >
      <template #icon>
        <Image :src="NO_PERMISSION" :preview="false" />
      </template>
      <template #extra>
        <Button type="primary" @click="handleToLogin">返回登录页</Button>
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
