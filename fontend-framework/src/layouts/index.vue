<script lang="ts" setup name="Layout">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { Breadcrumb, BreadcrumbItem, Layout } from 'ant-design-vue';

import DefaultHeader from './default/DefaultHeader.vue';
import DefaultSlider from './default/DefaultSlider.vue';

import SystemDrawer from '/@/layouts/config/SystemDrawer.vue';
import useAppStore from '/@/store/modules/app';
import { systemCss } from '/@/utils/config';

const route = useRoute();

const appStore = useAppStore();

const sliderWidth = computed(() =>
  appStore.collapsed
    ? systemCss.SLIDER_WIDTH_COLLAPSED
    : systemCss.SLIDER_WIDTH,
);

const breadcrumb = computed(() =>
  route.matched.slice(1).filter((k: any) => k.meta.title),
);
</script>

<template>
  <Layout class="main-layout">
    <DefaultHeader
      class="main-header"
      :style="{
        height: systemCss.HEADER_HEIGHT,
        lineHeight: systemCss.HEADER_HEIGHT,
      }"
    />
    <Layout class="main-container">
      <DefaultSlider class="main-slider" :width="sliderWidth" />
      <div
        class="main-content"
        :style="{ width: `calc(100% - ${sliderWidth})` }"
      >
        <Breadcrumb class="main-content-breadcrumb">
          <BreadcrumbItem
            v-for="(item, index) in breadcrumb"
            :key="JSON.stringify(item)"
          >
            <template v-if="item.meta.title">
              <span v-if="index + 1 === breadcrumb.length">
                {{ item.meta.title }}
              </span>
              <RouterLink v-else :to="item.path">
                {{ item.meta.title }}
              </RouterLink>
            </template>
          </BreadcrumbItem>
        </Breadcrumb>
        <div class="main-content-body">
          <RouterView />
        </div>
      </div>
    </Layout>
    <SystemDrawer />
  </Layout>
</template>

<style lang="scss">
$main: main;

.#{$main}-layout {
  min-width: 1366px;
  // width: 100%;
  height: 100%;
  overflow: hidden;

  .#{$main}-header {
    padding-inline: 25px;
    // height: @header-height;
    background: #fff;
  }

  .#{$main}-container {
    display: flex;
    width: 100%;
    // height: calc(100vh - @header-height);

    .#{$main}-slider {
      height: 100%;
      overflow: hidden auto;
      // width: @slider-width;
      background-color: #fff;
      // transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
    }

    .#{$main}-content {
      // width: calc(100vw - @slider-width);
      height: 100%;
      padding: 0 24px;
      background: #f8f9fc;
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;

      .ant-breadcrumb {
        padding: 10px 0;
        // a:hover{
        //   color: #2F54EB;
        //   background-color: transparent;
        // }
      }

      &-body {
        height: calc(100% - 42px);
        overflow: hidden auto;
      }
    }
  }
}
</style>
