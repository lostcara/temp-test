import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

// 查询字典类型列表
export const getDictTypePage = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/dict/type/list',
  });
};

// 查询字典类型详细
export const getDictTypeDetails = (
  dictId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/dict/type/${dictId}`,
  });
};

// 新增字典类型
export const addDictType = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/dict/type',
  });
};

// 修改字典类型
export const editDictType = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/dict/type',
  });
};

// 删除字典类型
export const deleteDictType = (
  dictId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: `/system/dict/type/${dictId}`,
  });
};

// 导出字典类型
export const exportDictType = (): Promise<AxiosResponse<any, any>> => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/dict/type/export',
  });
};

// 刷新字典缓存
export const refreshDictTypeCache = () => {
  return server.request({
    method: 'delete',
    url: '/system/dict/type/refreshCache',
  });
};

// 获取字典选择框列表
export const getDictTypeOptions = () => {
  return server.request({
    method: 'get',
    url: '/system/dict/type/optionselect',
  });
};

// 查询字典数据列表
export const getDictDataPage = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/dict/data/list',
  });
};

// 查询字典数据详细
export const getDictDataDetails = (
  dictCode: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/dict/data/${dictCode}`,
  });
};

// 根据字典类型查询字典数据信息
export const getDictTypeChildren = (
  dictType: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    neverCancel: true,
    url: `/system/dict/data/type/${dictType}`,
  });
};

// 新增字典数据
export const addDictData = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/dict/data',
  });
};

// 修改字典数据
export const editDictData = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/dict/data',
  });
};

// 删除字典数据
export const deleteDictData = (
  dictCode: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: `/system/dict/data/${dictCode}`,
  });
};

// 导出字典数据
export const exportDictData = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/dict/data/export',
  });
};
