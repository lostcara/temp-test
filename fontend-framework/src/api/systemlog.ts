import server from '/@/utils/request';

// 查询操作日志列表
export const getActionLogByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/monitor/operlog/list',
  });
};

// 删除操作日志
export const deleteOperlog = (operId: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/operlog/${operId}`,
  });
};

// 清空操作日志
export const cleanOperlog = () => {
  return server.request({
    method: 'delete',
    url: '/monitor/operlog/clean',
  });
};

// 导出操作日志
export const exportOperlog = () => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/monitor/operlog/export',
  });
};

// 获取登录日志
export const getLoginLogByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/monitor/logininfor/list',
  });
};

// 删除登录日志
export const deleteLoginlog = (infoId: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/logininfor/${infoId}`,
  });
};

// 解锁用户登录状态
export const unlockLoginlog = (userName: string) => {
  return server.request({
    method: 'get',
    url: `/monitor/logininfor/unlock/${userName}`,
  });
};

// 清空登录日志
export const cleanLoginlog = () => {
  return server.request({
    method: 'delete',
    url: '/monitor/logininfor/clean',
  });
};

// 导出登录日志
export const exportLoginlog = () => {
  return server.request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    responseType: 'blob',
    url: '/monitor/logininfor/export',
  });
};
