<script setup lang="ts" name="Model">
import { Card, Space } from 'ant-design-vue';

import FILE_IMG from './file.png';

import AlphaTable from '/@/components/AlphaTable/index.vue';
import useDownload from '/@/hooks/useDownload';

const { handleDownload } = useDownload();
</script>

<template>
  <AlphaTable :search-flag="false">
    <template #table>
      <Space>
        <Card title="模型原理" style="width: 300px">
          <template #extra>
            <a href="#" @click.prevent="handleDownload('模型原理')">下载</a>
          </template>
          <img :src="FILE_IMG" />
        </Card>
        <Card title="模型数据" style="width: 300px">
          <template #extra>
            <a href="#" @click.prevent="handleDownload('模型数据')">下载</a>
          </template>
          <img :src="FILE_IMG" />
        </Card>
        <Card title="模型特征" style="width: 300px">
          <template #extra>
            <a href="#" @click.prevent="handleDownload('模型特征')">下载</a>
          </template>
          <img :src="FILE_IMG" />
        </Card>
      </Space>
    </template>
  </AlphaTable>
</template>
