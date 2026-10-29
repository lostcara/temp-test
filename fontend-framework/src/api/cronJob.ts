import server from '/@/utils/request';

// 查询定时任务调度列表
export const getCronJobDataByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/monitor/job/list',
  });
};

// 查询定时任务调度详细
export const getCronJobDetails = (jobId: string) => {
  return server.request({
    method: 'get',
    url: `/monitor/job/${jobId}`,
  });
};

// 新增定时任务调度
export const addCronJob = (data: any) => {
  return server.request({
    data,
    method: 'post',
    url: '/monitor/job',
  });
};

// 修改定时任务调度
export const editCronJob = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/monitor/job',
  });
};

// 删除定时任务调度
export const deleteCronJob = (jobId: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/job/${jobId}`,
  });
};

// 任务状态修改
export const changeCronJobStatus = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/monitor/job/changeStatus',
  });
};

// 定时任务立即执行一次
export const runCronJob = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/monitor/job/run',
  });
};

// 导出定时任务
export const exportCronJob = (data: any) => {
  return server.request({
    data,
    method: 'post',
    url: '/monitor/job/export',
  });
};
