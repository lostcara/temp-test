import server from '/@/utils/request';
import type { AxiosResponse } from 'axios';

interface ResponseBasicType {
  code: number;
  data: any;
  token?: string;
}

// 获取验证码
export const getCodeImgApi = () => {
  return server.request({
    url: '/captchaImage',
    method: 'get',
    noToken: true,
  });
};

// 登录
export const loginApi = (data: any): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    url: '/login',
    method: 'post',
    noToken: true,
    data,
  });
};
