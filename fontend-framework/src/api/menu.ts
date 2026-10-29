import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

// 获取菜单列表
export const getMenuListByPage = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/menu/list',
  });
};

// 新增菜单
export const addMenu = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/menu',
  });
};

// 修改菜单
export const updateMenu = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/menu',
  });
};

// 删除菜单
export const deleteMenu = (
  menuId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: `/system/menu/${menuId}`,
  });
};
