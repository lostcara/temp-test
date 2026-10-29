<script lang="ts" setup name="SecurityForm">
import type { Rule } from 'ant-design-vue/es/form';

import { reactive, toRaw, UnwrapRef } from 'vue';

import { Button, Form, FormItem, InputPassword } from 'ant-design-vue';

import { editPwdData } from '/@/api/person';
import { messageWithKey } from '/@/hooks/useMessageKey';
import useUserStore from '/@/store/modules/user';
import { STORAGE_TOKEN } from '/@/utils/consts';
import { PATTERN_PASSWORD, RULE_PASSWORD } from '/@/utils/rules';
import Storage from '/@/utils/Storage';

interface FormState {
  newPassword: string;
  newPassword2: string;
  oldPassword?: string;
}

const userStore = useUserStore();

const formState: UnwrapRef<FormState> = reactive({
  newPassword: '',
  newPassword2: '',
  oldPassword: '',
});

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('');
  } else if (!PATTERN_PASSWORD.test(value)) {
    return Promise.reject(
      '密码必须包含字母、数字、特殊符号且在8-16位以内,不得输入空格',
    );
  } else if (value === formState.newPassword) {
    return Promise.resolve();
  } else {
    return Promise.reject('两次密码输入不同!');
  }
};

const rules: Record<string, Rule[]> = {
  newPassword: [{ message: '请输入新密码', required: true }, RULE_PASSWORD],
  newPassword2: [
    { message: '再次输入新密码', required: true },
    // RULE_PASSWORD,
    { validator: validatePass2 },
  ],
  oldPassword: [{ message: '请输入原密码', required: true }],
};

const onFinish = async () => {
  const values = toRaw(formState);
  const params = {
    confirm: values.newPassword,
    newPwd: values.newPassword,
    oldPwd: values.oldPassword,
  };
  const { code, msg }: any = await editPwdData(params);
  if (code === 200) {
    formState.oldPassword = '';
    formState.newPassword = '';
    formState.newPassword2 = '';
    messageWithKey.success(msg);
    // 返回 登录页面
    userStore.resetUserInfo();
    Storage.removeCookie(STORAGE_TOKEN);
    location.href = '/login';
  } else {
    messageWithKey.error(msg);
  }
};

const onFinishFailed = () => {};
</script>

<template>
  <div class="padding-40">
    <Form
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      class="w-px400"
      @finish="onFinish"
      @finish-failed="onFinishFailed"
    >
      <FormItem label="原密码" name="oldPassword">
        <InputPassword
          v-model:value="formState.oldPassword"
          placeholder="请输入原密码"
        />
      </FormItem>
      <FormItem label="新密码" name="newPassword">
        <InputPassword
          v-model:value="formState.newPassword"
          placeholder="请输入新密码"
        />
      </FormItem>
      <FormItem label="确认新密码" name="newPassword2">
        <InputPassword
          v-model:value="formState.newPassword2"
          placeholder="再次输入新密码"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 16, offset: 6 }">
        <Button type="primary" html-type="submit">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
