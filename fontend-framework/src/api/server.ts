import server from '/@/utils/request';

// 获取服务信息
export const getServerDataByPage = () => {
  return server.request({
    method: 'get',
    url: '/monitor/server',
  });
};
