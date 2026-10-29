import server from '/@/utils/request';

// 查询调度日志列表
export const getJobLogDataByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/monitor/jobLog/list',
  });
};

// 删除调度日志
export const deleteJobLogData = (jobLogId: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/jobLog/${jobLogId}`,
  });
};

// 清空调度日志
export const cleanJobLogData = () => {
  return server.request({
    method: 'delete',
    url: '/monitor/jobLog/clean',
  });
};

// 导出调度日志
export const exportJobLogData = (data: any) => {
  return server.request({
    data,
    method: 'post',
    url: '/monitor/jobLog/export',
  });
};
