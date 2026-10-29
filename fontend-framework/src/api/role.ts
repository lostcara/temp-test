import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

// 获取角色列表
export const getRoleList = (params: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/role/list',
  });
};

// 添加角色
export const addRole = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/role',
  });
};

// 编辑角色
export const editRole = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/role',
  });
};

// 删除角色
export const deleteRole = (
  data: string[],
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'delete',
    url: '/system/role',
  });
};

// 获取菜单下拉树列表
export const getRoleMenuTree = (): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: '/system/menu/treeselect',
  });
};

// 获取角色对应菜单列表
export const getRoleMenu = (
  roleId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/role/${roleId}`,
  });
};

// 导出角色数据
export const exportRoleData = (): Promise<AxiosResponse<any, any>> => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/role/export',
  });
};

// 设置角色数据权限
export const setRoleDataAuth = (
  data: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/role/dataScope',
  });
};

// 角色状态修改
export const changeRoleStatus = (
  data: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/role/changeStatus',
  });
};

// 查询角色已授权用户列表
export const getAllocatedUserList = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/role/authUser/allocatedList',
  });
};

// 查询角色未授权用户列表
export const getUnallocatedUserList = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/role/authUser/unallocatedList',
  });
};

// 取消用户授权角色
export const cancelAuthUser = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/role/authUser/cancel',
  });
};

// 批量取消用户授权角色
export const cancelAllAuthUser = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'put',
    params,
    url: '/system/role/authUser/cancelAll',
  });
};

// 授权用户选择
export const selectAllAuthUser = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'put',
    params,
    url: '/system/role/authUser/selectAll',
  });
};

// 根据角色ID查询部门树结构
export const getSelectDeptTree = (
  roleId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/role/deptTree/${roleId}`,
  });
};
