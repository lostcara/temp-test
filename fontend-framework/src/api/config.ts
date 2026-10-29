import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

// 查询参数列表
export const getConfigPage = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/config/list',
  });
};

// 查询参数详细
export const getConfigDetails = (
  configId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/config/${configId}`,
  });
};

// 根据参数键名查询参数值
export const getConfigKey = (
  configKey: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/config/configKey/${configKey}`,
  });
};

// 新增参数配置
export const addConfig = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/config',
  });
};

// 修改参数配置
export const editConfig = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/config',
  });
};

// 删除参数配置
export const deleteConfig = (
  configId: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: `/system/config/${configId}`,
  });
};

// 刷新参数缓存
export const refreshConfigCache = (): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: '/system/config/refreshCache',
  });
};

// 导出参数数据
export const exportConfigData = (): Promise<AxiosResponse<any, any>> => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/config/export',
  });
};
