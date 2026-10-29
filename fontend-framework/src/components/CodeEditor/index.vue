<script setup lang="ts" name="CodeEditor">
import { ref } from 'vue';

import { Button, Image, message, Textarea } from 'ant-design-vue';

const textValue = ref<string>('');

const imgPath = ref<string>('');

const analysisImageUrl = (urlStr: string) => {
  let imgPath = '';
  const path = window.atob(urlStr);
  imgPath = `data:image/png;base64,${path}`;
  return imgPath;
};

const handleClick = () => {
  if (textValue.value) {
    imgPath.value = analysisImageUrl(textValue.value);
  } else {
    message.error('请添加数据');
  }
};
</script>

<template>
  <div>
    <Textarea v-model:value="textValue" placeholder="Basic usage" :rows="4" />
    <Button type="primary" @click="handleClick">转化</Button>
    <Image v-if="imgPath" :width="400" :src="imgPath" />
  </div>
</template>
