<script setup lang="ts" name="DefaultHeader">
import { useRouter } from 'vue-router';

import { BellOutlined } from '@ant-design/icons-vue';
import {
  Badge,
  Dropdown,
  LayoutHeader,
  Menu,
  MenuItem,
  Space,
} from 'ant-design-vue';

import LOGO from '/@/assets/img/logo-other.jpg';
import SvgIcon from '/@/components/SvgIcon/svg-icon.vue';
// import useAppStore from '/@/store/modules/app';
import useUserStore from '/@/store/modules/user';
import { STORAGE_TOKEN } from '/@/utils/consts';
import Storage from '/@/utils/Storage';

const router = useRouter();

// const appStore = useAppStore();

const userStore = useUserStore();

// const toggleCollapsed = appStore.toggleCollapsed;

const toPersonal = () => {
  router.push({
    path: '/person-center',
  });
};

const handleExit = () => {
  // 清除
  userStore.resetUserInfo();
  Storage.removeCookie(STORAGE_TOKEN);
  location.href = '/login';
};
</script>

<template>
  <LayoutHeader class="default-header">
    <div class="default-header-logo">
      <img :src="LOGO" alt="logo" srcset="" />
      <span
        style="
          padding-left: 8px;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
        "
        @click="$router.push('/home')"
      >
        设备管理系统
      </span>
    </div>
    <div class="default-header-center">
      <!-- <Button type="primary" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="appStore.collapsed" />
        <MenuFoldOutlined v-else />
      </Button> -->
    </div>
    <div class="default-header-right">
      <Space :size="16">
        <a href="#">
          <Badge count="5">
            <BellOutlined style="font-size: 16px" />
          </Badge>
        </a>
        <Dropdown placement="bottomRight">
          <span class="right-dropdown">
            <SvgIcon name="avatar" class-name="icon-size-20" />
          </span>
          <template #overlay>
            <Menu>
              <MenuItem @click="toPersonal">个人中心</MenuItem>
              <MenuItem @click="handleExit">退出</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </Space>
    </div>
  </LayoutHeader>
</template>

<style lang="scss">
$default-header: default-header;

.#{$default-header} {
  z-index: 10;
  display: flex;
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 8px #cdd1e026;

  &-logo {
    display: flex;
    align-items: center;
    width: 272px;

    &-img {
      height: 40px;
      padding-left: 29px;
    }
  }

  &-center {
    flex: 1;
  }

  .right-dropdown {
    display: flex;
    align-items: center;
    line-height: 32px;
  }

  .icon-size-20 {
    font-size: 24px !important;
  }
}
</style>
