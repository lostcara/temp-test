<script lang="ts" setup name="PasswordLogin">
import { reactive } from 'vue';

import { useLogin } from './hooks/useLogin';

defineProps({
  submitLoading: {
    default: false,
    type: Boolean,
  },
});
const { userLoginApi } = useLogin();
const formState = reactive({
  password: '',
  username: '',
});

const handleSubmit = () => {
  const submitData = {
    password: formState.password,
    username: formState.username,
  };
  userLoginApi(
    {
      ...submitData,
    },
    () => {},
  );
};
</script>

<template>
  <a-form :model="formState" layout="vertical">
    <a-form-item>
      <a-input
        v-model:value="formState.username"
        class="login-form-input"
        placeholder="手机号/账号"
      />
    </a-form-item>
    <a-form-item>
      <a-input-password
        v-model:value="formState.password"
        class="login-form-input"
        placeholder="密码"
      />
    </a-form-item>
    <a-button type="link" class="forgot-password"> 忘记密码 </a-button>
    <a-button
      :loading="submitLoading"
      class="login-form-submit"
      type="primary"
      @click="handleSubmit"
    >
      登录
    </a-button>
  </a-form>
</template>

<style lang="scss" scoped>
@use 'sass:color';
$primary-color: #4a73f3;
$border-radius: 9px;

.login-form-input {
  height: 61px;
  padding: 18px 22px;
  font-size: 17px;
  background: #ffff;
  border-radius: $border-radius;

  :deep(.ant-input) {
    background: transparent;
  }
}

.login-form-submit {
  width: 100%;
  height: 61px;
  margin-top: 35px;
  font-size: 17px;
  font-weight: 400;
  background: $primary-color;
  border: none;
  border-radius: $border-radius;

  &:hover {
    background: color.adjust($primary-color, $lightness: 5%);
  }
}

.forgot-password {
  position: absolute;
  top: 160px;
  right: 0;
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
