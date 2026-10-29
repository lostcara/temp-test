import server from '/@/utils/request';

export interface DeviceInfoQueryParams {
  deviceName?: string;
  deviceNumber?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface DeviceInfoItem {
  id?: string;
  deviceName: string;
  deviceNumber: string;
  deviceType: string;
  businessScenario: string;
  securityStatus: '正常' | '过载';
  cpuStatus: '正常' | '过载';
  networkStatus: '正常' | '过载';
  businessStatus: '正常' | '过载';
}

// 获取设备信息列表
export const fetchDeviceInfoList = (params: DeviceInfoQueryParams) => {
  return server.request({
    url: '/device-infos',
    method: 'get',
    params,
  });
};

// 获取设备信息详情
export const fetchDeviceInfoDetail = (id: string) => {
  return server.request({
    method: 'get',
    url: `/device-infos/${id}`,
  });
};

// 导入设备信息数据（支持文件上传）
export const importDeviceInfoData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return server.request({
    method: 'post',
    url: '/device-infos/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除设备信息
export const deleteDeviceInfo = (id: string) => {
  return server.request({
    method: 'delete',
    url: `/device-infos/${id}`,
  });
};

// 批量删除设备信息
export const batchDeleteDeviceInfos = (ids: string[]) => {
  return server.request({
    method: 'delete',
    url: '/device-infos',
    data: {
      ids,
    },
  });
};

