import server from '/@/utils/request';

// 查询岗位列表
export const getPostDataByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/system/post/list',
  });
};

// 查询岗位详细
export const getPostDataItem = (postId: string) => {
  return server.request({
    method: 'get',
    url: `/system/post/${postId}`,
  });
};

// 新增岗位
export const addPostData = (data: any) => {
  return server.request({
    data,
    method: 'post',
    url: '/system/post',
  });
};

// 修改岗位
export const editPostData = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/system/post',
  });
};

// 删除岗位
export const deletePostData = (postId: string) => {
  return server.request({
    method: 'delete',
    url: `/system/post/${postId}`,
  });
};

// 导出岗位数据
export const exportPostData = (data: any) => {
  return server.request({
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/system/post/export',
  });
};
