import type { AxiosResponse } from 'axios';

import server from '/@/utils/request';

// 查询公告列表
export const getNoticeDataByPage = (
  params: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    params,
    url: '/system/notice/list',
  });
};

// 查询公告详细
export const getNoticeDetails = (
  noticeId: string,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'get',
    url: `/system/notice/${noticeId}`,
  });
};

// 新增公告
export const addNoticeData = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'post',
    url: '/system/notice',
  });
};

// 修改公告
export const editNoticeData = (data: any): Promise<AxiosResponse<any, any>> => {
  return server.request({
    data,
    method: 'put',
    url: '/system/notice',
  });
};

// 删除公告
export const deleteNoticeData = (
  noticeId: any,
): Promise<AxiosResponse<any, any>> => {
  return server.request({
    method: 'delete',
    url: `/system/notice/${noticeId}`,
  });
};
