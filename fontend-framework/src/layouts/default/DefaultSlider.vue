<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';

import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LayoutSider, Menu, MenuItem, SubMenu } from 'ant-design-vue';

import SvgIcon from '/@/components/SvgIcon/svg-icon.vue';
import useAppStore from '/@/store/modules/app';
import useRouteStore from '/@/store/modules/route';
import { systemCss } from '/@/utils/config';
import { MENU_ROUTER_NAME } from '/@/utils/consts';

const appStore = useAppStore();

const routeStore = useRouteStore();

const route = useRoute();

const router = useRouter();

const sliderWidth = computed(() =>
  appStore.collapsed
    ? systemCss.SLIDER_WIDTH_COLLAPSED
    : systemCss.SLIDER_WIDTH,
);

// 获取当前打开的子菜单
const getOpenKeys = (): string[] => [route.matched[1]?.name] as string[];

const getSelectedKeys = () => {
  const routrName = route.name as string;
  return [routrName.replace('/details', '')];
};

const openKeys = ref<string[]>(getOpenKeys());

const selectedKeys = ref<string[]>(getSelectedKeys());

// 需要动态变化
const menus = computed(
  () =>
    routeStore.routes.find((item) => item.name === MENU_ROUTER_NAME)
      ?.children || [],
);

const handleClick: MenuProps['onClick'] = ({ key }) => {
  router.push({ name: key as string });
};

// 监听菜单收缩
watch(
  () => appStore.collapsed,
  (newVal) => {
    openKeys.value = newVal ? [] : getOpenKeys();
    selectedKeys.value = getSelectedKeys();
  },
);

// 监听路由变化
watch(route, () => {
  openKeys.value = getOpenKeys();
  selectedKeys.value = getSelectedKeys();
});
</script>

<template>
  <LayoutSider class="default-slider" :collapsed="appStore.collapsed">
    <Menu
      v-model:open-keys="openKeys"
      v-model:selected-keys="selectedKeys"
      mode="inline"
      :inline-collapsed="appStore.collapsed"
      :style="{ width: sliderWidth, flex: `0 0 ${sliderWidth}` }"
      class="default-slider-menu"
      @click="handleClick"
    >
      <template v-for="menu in menus" :key="menu.name">
        <template v-if="!menu.meta?.hidden">
          <SubMenu
            v-if="menu.children && menu.children.length > 0"
            :key="menu.name"
          >
            <template v-if="menu.meta?.icon" #icon>
              <SvgIcon
                :name="menu.meta?.icon as string"
                :class="appStore.collapsed ? '' : 'margin-left-48'"
              />
            </template>
            <template #title>
              <span :class="menu.meta?.icon ? '' : 'margin-left-48'">{{
                menu.meta?.title
              }}</span>
            </template>
            <template v-for="item in menu.children" :key="item.name">
              <template v-if="!item.meta?.hidden">
                <MenuItem :key="item.name">
                  <span :class="appStore.collapsed ? '' : 'margin-left-48'">{{
                    item.meta?.title
                  }}</span>
                </MenuItem>
              </template>
            </template>
          </SubMenu>
          <template v-else>
            <MenuItem :key="menu.name">
              <template v-if="menu.meta?.icon" #icon>
                <SvgIcon
                  :name="menu.meta?.icon as string"
                  :class="appStore.collapsed ? '' : 'margin-left-48'"
                />
              </template>
              <span :class="menu.meta?.icon ? '' : 'margin-left-48'">{{
                menu.meta?.title
              }}</span>
            </MenuItem>
          </template>
        </template>
      </template>
    </Menu>
  </LayoutSider>
</template>

<style lang="scss">
.default-slider {
  background-color: #fff;
  // width: 100%;
  // transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  .default-slider-menu {
    height: 100%;
    padding: 12px;
  }

  .ant-menu-light.ant-menu-root.ant-menu-inline {
    border: none;
  }

  .ant-menu-light.ant-menu-root.ant-menu-vertical {
    border: none;
  }

  .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    height: 50px;
    line-height: 50px;
  }

  .ant-menu-inline .ant-menu-item {
    height: 50px;
    line-height: 50px;
  }

  .ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background-color: transparent;
  }

  .ant-menu-inline .ant-menu-item::before {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 4px;
    height: 34px;
    content: '';
    background-color: #2f54eb;
    border-radius: 8px;
    opacity: 0;
    transition:
      transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
      opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: scaleY(0.0001);
  }

  .ant-menu-inline .ant-menu-item-selected::before {
    opacity: 1;
    transition:
      transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
      opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform: scaleY(1);
  }

  .ant-menu-inline .ant-menu-submenu-arrow::before {
    transform: rotate(135deg) translateX(2.5px);
  }

  .ant-menu
    .ant-menu-submenu-open.ant-menu-submenu-inline
    > .ant-menu-submenu-title
    > .ant-menu-submenu-arrow::before {
    transform: rotate(-45deg) translateX(2.5px);
  }

  .ant-menu
    .ant-menu-submenu-open.ant-menu-submenu-inline
    > .ant-menu-submenu-title
    > .ant-menu-submenu-arrow::after {
    transform: rotate(45deg) translateX(-2.5px);
  }

  .ant-menu
    .ant-menu-submenu-open.ant-menu-submenu-inline
    > .ant-menu-submenu-title
    > .ant-menu-submenu-arrow {
    transform: none;
  }
}
</style>
