import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

interface ResponseBasicType {
  code: number;
  data: any;
  token?: string;
}
// 获取用户信息
export const userInfoApi = () => {
  return server.request({
    method: 'get',
    url: '/getInfo',
  });
};

// 获取路由信息
export const routersApi = () => {
  return server.request({
    method: 'get',
    url: '/getRouters',
  });
};

// 获取角色列表
export const getRoleList = () => {
  return server.request({
    method: 'get',
    url: '/system/role/select',
  });
};

// 获取用户列表
export const getUserList = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/system/user/list',
  });
};

// 新增用户
export const addUserData = (
  data: any,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/user',
  });
};

// 编辑用户
export const editUserData = (
  data: any,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/user',
  });
};

// 查询授权角色
export const getAuthRoleOptions = (
  userId: string,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    method: 'get',
    url: `/system/user/authRole/${userId}`,
  });
};

// 用户授权角色
export const userAssigningRoles = (
  data: any,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/user/authRole',
  });
};

// 删除用户
export const delUser = (
  userId: string,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    method: 'delete',
    url: `/system/user/${userId}`,
  });
};

// 重置密码
// export const resetPassword = (data: any): Promise<AxiosResponse<any, ResponseBasicType>> => {
//   return server.request({
//     url: `/system/user/resetPwd/${data}`,
//     method: 'put',
//   });
// };

// 重置密码
export const resetPassword = (
  data: any,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    data,
    method: 'put',
    url: `/system/user/resetPwd`,
  });
};

// 查询部门下拉树结构
export const getDeptTreeOptions = (): Promise<
  AxiosResponse<any, ResponseBasicType>
> => {
  return server.request({
    method: 'get',
    neverCancel: true,
    url: '/system/user/deptTree',
  });
};

// 用户状态修改
export const changeUserStatus = (
  data: any,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/user/changeStatus',
  });
};

// 导出用户数据
export const exportUserData = (): Promise<
  AxiosResponse<any, ResponseBasicType>
> => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/user/export',
  });
};

// 下载模板
export const downloadUserXlsx = (): Promise<
  AxiosResponse<any, ResponseBasicType>
> => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/user/importTemplate',
  });
};

// 导入
export const importUserData = (
  data: any,
  checked = false,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  const url = checked
    ? `/system/user/importData?updateSupport=${checked}`
    : '/system/user/importData';
  return server.request({
    data,
    method: 'post',
    url,
  });
};

// 获取角色和数据权限
export const getRoleAndPostOptions = (): Promise<
  AxiosResponse<any, ResponseBasicType>
> => {
  return server.request({
    method: 'get',
    url: '/system/user/',
  });
};

// 获取用户详情
export const getUserData = (
  userId: string,
): Promise<AxiosResponse<any, ResponseBasicType>> => {
  return server.request({
    method: 'get',
    url: `/system/user/${userId}`,
  });
};
