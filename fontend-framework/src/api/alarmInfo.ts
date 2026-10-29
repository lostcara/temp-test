import server from '/@/utils/request';

export interface AlarmInfoQueryParams {
  alarmNumber?: string;
  deviceName?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const fetchAlarmInfoList = (params: AlarmInfoQueryParams) => {
  return server.request({
    url: '/alarm-infos',
    method: 'get',
    params,
  });
};

export const fetchAlarmInfosByStatus = (status: string) => {
  return server.request({
    method: 'get',
    url: `/alarm-infos/status/${status}`,
  });
};

export const fetchAlarmInfoStatusSummary = () => {
  return server.request({
    method: 'get',
    url: '/alarm-infos/statuses/summary',
  });
};

// 导入告警信息数据（支持文件上传）
export const importAlarmInfoData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return server.request({
    method: 'post',
    url: '/alarm-infos/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除告警信息
export const deleteAlarmInfo = (id: string) => {
  return server.request({
    method: 'delete',
    url: `/alarm-infos/${id}`,
  });
};

// 批量删除告警信息
export const batchDeleteAlarmInfos = (ids: string[]) => {
  return server.request({
    method: 'delete',
    url: '/alarm-infos',
    data: {
      ids,
    },
  });
};
