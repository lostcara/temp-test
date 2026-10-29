import axios, {
  InternalAxiosRequestConfig,
  // Canceler,
  AxiosResponse,
} from 'axios';
import { messageWithKey } from '../hooks/useMessageKey';
import Storage from '/@/utils/Storage';
import { STORAGE_TOKEN, MODE_DEVELOPMENT } from '/@/utils/consts';
import { createUUID } from './common';
import { Modal } from 'ant-design-vue';
import useUserStore from '/@/store/modules/user';
// import router from '/@/router';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    noToken?: boolean;
    neverCancel?: boolean;
    needInterrupt?: string;
  }
}

// const CancelToken = axios.CancelToken;

const server = axios.create({
  baseURL: '/api',
  timeout: 30000, // 增加到30秒，给后端更多响应时间
});

// 记录正在进行的请求
const pending: any[] = [];

// 产生请求记录
export const createPendingRecordKey = (config?: any) => {
  if (config) {
    return config?.url;
  }
  return createUUID();
};

// 删除请求记录
export const removePendingRecord = (key: string) => {
  const index = pending.findIndex((k) => k.key === key);
  if (index !== -1) {
    // 清除记录
    pending.splice(1, index);
  }
};

// 打断请求
export const interruptPendingApi = (key: string) => {
  // 将 接口的地址 + 参数 作为 key
  const item = pending.find((k) => k.key === key);
  if (item && item.source) {
    item.source.cancel();
    // 清除记录
    removePendingRecord(key);
  }
};

/**
 * 参数处理
 * @param {*} params  参数
 */
const tansParams = (params: any) => {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + '=';
    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof value[key] !== 'undefined') {
            const params = propName + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
};

/**
 * 处理请求错误
 * @param error 错误信息
 */
const dealWithRequestError = (error: any): void => {
  messageWithKey.error(error);
};

/**
 * 取消重复请求
 * @param config axiosConfig
 * @param cancel 取消函数
 */
// const removePending = (config: InternalAxiosRequestConfig, cancel: Canceler | null) => {
//   const flgUrl = config?.url;
//   if (pending.includes(flgUrl)) {
//     if (cancel) {
//       // 取消请求（message 参数是可选的）
//       cancel();
//     } else {
//       pending.splice(pending.indexOf(flgUrl), 1); // 删除记录
//     }
//   } else {
//     if (cancel) {
//       pending.push(flgUrl);
//     }
//   }
// };

// 请求拦截器 （取消重复请求，判断是否携带token）
server.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1.对get请求进行特殊处理
    if (config.method === 'get' && config.params) {
      const paramsString = tansParams(config.params);
      if (paramsString) {
        // 去掉末尾的 & 符号
        const cleanParams = paramsString.endsWith('&')
          ? paramsString.slice(0, -1)
          : paramsString;
        // 检查 URL 是否已经包含查询参数
        const separator = config.url?.includes('?') ? '&' : '?';
        const finalUrl = config.url + separator + cleanParams;
        // 开发环境打印请求 URL 用于调试
        if (import.meta.env.MODE === 'development') {
          console.log('🔍 GET 请求:', {
            baseURL: config.baseURL,
            originalUrl: config.url,
            params: config.params,
            finalUrl,
          });
        }
        config.url = finalUrl;
      }
      config.params = {};
    }
    // 2.判断是否携带token
    // 3.取消重复请求
    // 4.最大并发数量(?)

    // 是否携带token标志
    const noToken = config.noToken || false;

    // 创建一个 CancelToken 源
    const source = axios.CancelToken.source();

    // 是否取消重复请求
    const neverCancel = config.neverCancel || false;
    // 是否需要中断请求
    const needInterrupt = config.needInterrupt || false;
    if (!neverCancel) {
      const neverCancelKey = createPendingRecordKey(config);
      // 判断当前请求是否正在进行
      interruptPendingApi(neverCancelKey);
      // 生成 cancelToken
      pending.push({
        key: neverCancelKey,
        source,
      });
      Object.assign(config, {
        cancelToken: source.token,
      });
      // config.cancelToken = new CancelToken((c: Canceler) => {
      //   removePending(config, c);
      // });
    }

    if (needInterrupt) {
      pending.push({
        key: needInterrupt,
        source,
      });
      Object.assign(config, {
        cancelToken: source.token,
      });
    }

    // 2.判断是否携带token
    const token = Storage.getCookie(STORAGE_TOKEN);

    if (token && !noToken) {
      Object.assign(config.headers, {
        Authorization: `Bearer ${token}`,
      });
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    // 处理上上一个请求出错情况
    // 开发环境对请求错误抛错提醒
    if (import.meta.env.MODE === MODE_DEVELOPMENT) {
      dealWithRequestError(error);
    }

    return Promise.reject(error);
  },
);

// 添加响应拦截器
server.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    const userStore = useUserStore();
    // 对响应数据做点什么
    // 对请求成功的请求删除记录
    removePendingRecord(createPendingRecordKey(res.config));
    // removePending(res.config, null);

    const { code = 200 } = res.data;

    // 对不同的code进行处理
    // token失效或无权限
    if (code === 401) {
      Modal.destroyAll();
      Modal.confirm({
        content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        onOk: () => {
          userStore.clearUserInfo(() => {
            // 清除token
            // 跳转路由
            Storage.removeCookie(STORAGE_TOKEN);
            // router.replace({ path: '/login' });
            location.href = '/login';
          });
        },
        onCancel: () => {
          Modal.destroyAll();
        },
      });
      return Promise.reject();
    }

    // 开发环境打印响应数据用于调试
    if (import.meta.env.MODE === 'development') {
      console.log('✅ 响应数据:', {
        url: res.config.url,
        status: res.status,
        data: res.data,
      });
    }

    return res.data;
  },
  function (error) {
    const userStore = useUserStore();
    // 对响应错误做点什么
    const { config, message: errorMsg } = error;
    // 对请求成功的请求删除记录
    removePendingRecord(createPendingRecordKey(config));
    // removePending(config, null);
    let alertMsg = errorMsg;
    if (errorMsg == 'Network Error' || error.code === 'ERR_NETWORK') {
      alertMsg =
        '后端接口连接异常，请确保后端服务已启动（http://localhost:3000）';
    } else if (errorMsg.includes('timeout') || error.code === 'ECONNABORTED') {
      alertMsg = '系统接口请求超时，请检查后端服务是否正常运行';
    } else if (errorMsg.includes('Request failed with status code 424')) {
      Modal.destroyAll();
      Modal.confirm({
        content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        onOk: () => {
          userStore.clearUserInfo(() => {
            // 清除token
            // 跳转路由
            Storage.removeCookie(STORAGE_TOKEN);
            location.href = '/login';
          });
        },
        onCancel: () => {
          Modal.destroyAll();
        },
      });
      return Promise.reject();
    } else if (errorMsg.includes('Request failed with status code')) {
      alertMsg = '系统接口' + errorMsg.substr(errorMsg.length - 3) + '异常';
    } else if (error.code === 'ERR_CANCELED') {
      alertMsg = '请求已中断！';
    }
    messageWithKey.error(alertMsg);
    return Promise.reject(error);
  },
);

export default server;
