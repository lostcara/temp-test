import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { messageWithKey } from '/@/hooks/useMessageKey';
import { STORAGE_TOKEN } from '/@/utils/consts';
import Storage from '/@/utils/Storage';

export const useLogin = () => {
  const loading = ref<boolean>(false);
  const router = useRouter();

  const userLoginApi = async (value: any, resolve?: any, reject?: any) => {
    loading.value = true;

    setTimeout(() => {
      if (value.username === 'admin' && value.password === '123456') {
        Storage.setCookie(STORAGE_TOKEN, 'xxxxxxxxxxxxxxxxxxx');
        loading.value = false;
        messageWithKey.success('登录成功！');
        if (resolve) {
          resolve();
        }
        // 跳转至登录页
        // 1.记录登出的位置需还原
        router.push('/');
      } else {
        loading.value = false;
        messageWithKey.error('账号或密码错误！');
        if (reject) {
          reject();
        }
      }
    }, 1000);
    // const { code, msg, token }: any = await loginApi(value);
    // if (code === 200) {
    //   if (isNotEmpty(token)) {
    //     Storage.setCookie(STORAGE_TOKEN, token);
    //   }
    //   loading.value = false;
    //   messageWithKey.success(msg);
    //   // 保存 token
    //   if (resolve) {
    //     resolve();
    //   }
    //   // 跳转至登录页
    //   // 1.记录登出的位置需还原
    //   router.push('/');
    // } else {
    //   loading.value = false;
    //   messageWithKey.error(msg);
    //   if (reject) {
    //     reject();
    //   }
    // }
  };

  return {
    loading,
    userLoginApi,
  };
};
