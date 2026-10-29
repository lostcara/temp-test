<script lang="ts" setup name="LoginForm">
import { reactive } from 'vue';

defineProps({
  codeLoading: {
    default: false,
    type: Boolean,
  },
  submitLoading: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(['submit']);

const formState = reactive({
  code: '',
  password: '',
  phone: '',
});

const handleLogin = () => {
  // 在提交前转换数据类型
  const submitData = {
    code: formState.code,
    password: formState.password,
    phone: Number(formState.phone), // 如果手机号需要数字类型
  };

  emit('submit', submitData);
};

const getCode = () => {
  // eslint-disable-next-line no-console
  console.log('获取验证码');
};
</script>

<template>
  <a-form :model="formState" layout="vertical">
    <a-form-item>
      <a-input
        v-model:value="formState.phone"
        class="login-form-input"
        placeholder="手机号"
      />
    </a-form-item>
    <a-form-item class="verification-code-item">
      <a-input
        v-model:value="formState.code"
        class="login-form-input"
        placeholder="验证码"
      />
      <a-button
        :loading="codeLoading"
        class="verification-code-button"
        @click="getCode"
      >
        获取验证码
      </a-button>
    </a-form-item>
    <a-button type="link" @click="handleLogin" class="forgot-password">
      忘记密码
    </a-button>
    <a-button
      :loading="submitLoading"
      class="login-form-submit"
      type="primary"
      @click="handleLogin"
    >
      登录
    </a-button>
  </a-form>
</template>

<style lang="scss" scoped>
@use 'sass:color';
$primary-color: #4a73f3;
$border-radius: 10px;

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

.verification-code-item {
  position: relative;

  .verification-code-button {
    position: absolute;
    top: 50%;
    right: 0;
    width: 110px;
    height: 61px;
    font-size: 15px;
    color: #464646;
    background: #f5f5f5;
    border-radius: 0 10px 10px 0;
    transform: translateY(-50%);
  }
}

.forgot-password {
  position: absolute;
  top: 160px;
  right: 0;
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
