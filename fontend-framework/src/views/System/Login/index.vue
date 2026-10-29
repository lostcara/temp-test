<script setup lang="ts" name="Login">
import { useCodeImage } from './hooks/useCodeImage';
import { useLogin } from './hooks/useLogin';
import LoginForm from './LoginForm.vue';

import { getCodeImgApi } from '/@/api/common';

const {
  getFetchData: getCodeImgData,
  imgUrl,
  isFail,
  loading,
  showCode,
  uuidCode,
} = useCodeImage(getCodeImgApi);

const { loading: submitLoading, userLoginApi } = useLogin();

const handleSubmit = (values: any) => {
  userLoginApi(
    {
      ...values,
      uuid: uuidCode.value,
    },
    () => {},
    () => {
      getCodeImgData();
    },
  );
};
</script>

<template>
  <div class="login-container">
    <div class="login-theme">
      <div class="title-main">交通异构终端安全防护系统</div>
      <div class="title-english">Equipment Management System</div>
      <img src="/src/assets/img/system-logo.png" />
    </div>
    <div class="login-content">
      <LoginForm
        :show-code="showCode"
        :code-loading="loading"
        :code-fail-flag="isFail"
        :code-img-url="imgUrl"
        :re-fresh-code="getCodeImgData"
        :submit-loading="submitLoading"
        @submit="handleSubmit"
      />
    </div>
    <div class="login-footer">
      <span> Copyright ©2022-2026 Sunshine All Rights Reserved </span>
    </div>
  </div>
</template>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-height: 100vh;
  padding: 0 10% 0 120px;
  background-color: #e8ebf0;
}

.login-theme {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title-main {
    font-size: 40px;
    font-weight: 600;
  }

  .title-english {
    margin: 10px 0;
  }
}

.login-left {
  h1 {
    margin-bottom: 8px;
    font-size: 32px;
    color: #333;
  }

  p {
    font-size: 16px;
    color: #666;
  }
}

.login-content {
  width: 460px;
}

.login-footer {
  position: absolute;
  bottom: 10px;
  color: #494b4f;
}
</style>
