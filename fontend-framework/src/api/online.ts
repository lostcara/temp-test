import server from '/@/utils/request';

// 查询在线用户列表
export const getOnlineDataByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/monitor/online/list',
  });
};

// 强退用户
export const forceUserLogout = (tokenId: any) => {
  return server.request({
    method: 'delete',
    url: `/monitor/online/${tokenId}`,
  });
};
