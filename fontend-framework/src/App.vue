<script setup lang="ts">
import { computed, h } from 'vue';

import { LoadingOutlined } from '@ant-design/icons-vue';
import { Spin } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

import EMPTY_DEFAULT from '/@/assets/img/empty-default.png';
import BasicRouteView from '/@/components/RouteContainer/BasicRouteView.vue';
import useAppStore from '/@/store/modules/app';
import { ThemeToken } from '/@/utils/themeToken';

const appStore = useAppStore();
dayjs.locale('zh-cn');
const locale = computed(() => (appStore.locale === 'zh' ? zhCN : enUS));
// 全局加载中样式
Spin.setDefaultIndicator({
  indicator: h(LoadingOutlined, {
    class: 'anticon anticon-loading anticon-spin ant-spin-dot',
  }),
});
</script>

<template>
  <AConfigProvider
    :theme="{
      token: {
        colorPrimary: appStore.themeColor,
        ...ThemeToken.token,
      },
      components: {
        ...ThemeToken.components,
      },
    }"
    :locale="locale"
  >
    <!-- 全局空状态 -->
    <template #renderEmpty>
      <div class="text-align-center">
        <img :src="EMPTY_DEFAULT" width="48" alt="" class="margin-bottom-4" />
        <p class="font-color-disabled">暂无数据</p>
      </div>
    </template>
    <BasicRouteView />
  </AConfigProvider>
</template>
