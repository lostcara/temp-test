<script lang="ts" setup name="LoginForm">
import { ref } from 'vue';

import PasswordLogin from './PasswordLogin.vue';
import VerificationCodeLogin from './VerificationCodeLogin.vue';

defineProps({
  codeFailFlag: {
    default: false,
    type: Boolean,
  },
  codeImgUrl: {
    required: true,
    type: String,
  },
  codeLoading: {
    default: false,
    type: Boolean,
  },
  reFreshCode: {
    required: true,
    type: Function,
  },
  showCode: {
    default: true,
    type: Boolean,
  },
  submitLoading: {
    default: false,
    type: Boolean,
  },
});

const activeKey = ref('password'); // 默认显示验证码登录

const handleRegister = () => {
  // eslint-disable-next-line no-console
  console.log('跳转到注册页');
};
</script>

<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <div class="scan-code-login">
        <img src="/src/assets/img/scan-logo.png" /><span>微信扫码登入</span>
      </div>
      <div class="qr-code"><img src="/src//assets/img/qr-code-logo.png" /></div>
      <a-tabs v-model:active-key="activeKey" class="login-tabs" centered>
        <a-tab-pane key="password" tab="密码登录">
          <PasswordLogin />
        </a-tab-pane>

        <a-tab-pane key="code" tab="验证码登录">
          <VerificationCodeLogin />
        </a-tab-pane>
      </a-tabs>

      <div class="footer">
        <span>没有账号？</span>
        <a href="#" @click="handleRegister">立即注册</a>
      </div>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #4a73f3;
$border-radius: 9px;

.login-container {
  width: 100%;
  padding: 0;
}

.login-card {
  width: 500px;
  padding: 25px 30px;
  background: #fafbfc;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
}

.scan-code-login {
  position: absolute;
  top: 0;
  right: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 30px;
  color: #4a73f3;
  cursor: pointer;
  background-color: #e3e6fb;
}

.qr-code {
  position: absolute;
  top: -3px;
  right: 0;
}

.login-tabs {
  //去掉 Tabs 导航栏底部的默认分隔线或装饰线。
  :deep(.ant-tabs-nav) {
    margin-bottom: 35px;

    &::before {
      display: none;
    }
  }

  :deep(.ant-tabs-tab) {
    padding: 13px 0;
    margin: 0 53px 0 0;
    font-size: 17px;

    .ant-tabs-tab-btn {
      font-size: 17px;
      color: #999;
    }
  }

  :deep(.ant-tabs-tab-active) {
    .ant-tabs-tab-btn {
      font-weight: 500;
      color: #333 !important;
    }
  }

  :deep(.ant-tabs-ink-bar) {
    height: 2px;
    background: #4b7bec;
  }
}

.footer {
  margin-top: 26px;
  font-size: 15px;
  text-align: center;

  span {
    color: #999;
  }

  a {
    margin-left: 4px;
    color: $primary-color;
    text-decoration: none;
  }
}

// 输入框错误状态样式
.ant-input-status-error:not(.ant-input-disabled):not(
    .ant-input-borderless
  ).ant-input,
.ant-input-affix-wrapper-status-error:not(
    .ant-input-affix-wrapper-disabled
  ):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper {
  background: #fff;
  border: 1px solid #ff4d4f;
}
</style>
