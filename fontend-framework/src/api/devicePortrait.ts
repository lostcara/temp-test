import server from '/@/utils/request';

export interface DevicePortraitQueryParams {
  deviceName?: string;
  deviceNumber?: string;
  page?: number;
  pageSize?: number;
}

export interface DevicePortraitItem {
  id?: string;
  deviceName: string;
  deviceNumber: string;
  deviceType: string;
  businessScenario: string;
  portrait: string;
  protectionPlan: string;
  assetImportance?: number; // 资产重要性
  dataImportance?: number; // 数据重要性
  networkImportance?: number; // 网络重要性
  businessImportance?: number; // 业务重要性
}

// 获取设备画像列表
export const fetchDevicePortraitList = (params: DevicePortraitQueryParams) => {
  return server.request({
    url: '/device-portraits',
    method: 'get',
    params,
  });
};

// 获取设备画像详情
export const fetchDevicePortraitDetail = (id: string) => {
  return server.request({
    method: 'get',
    url: `/device-portraits/${id}`,
  });
};

// 创建设备画像
export const createDevicePortrait = (data: Partial<DevicePortraitItem>) => {
  return server.request({
    method: 'post',
    url: '/device-portraits',
    data,
  });
};

// 更新设备画像
export const updateDevicePortrait = (
  id: string,
  data: Partial<DevicePortraitItem>,
) => {
  return server.request({
    method: 'put',
    url: `/device-portraits/${id}`,
    data,
  });
};

// 删除设备画像
export const deleteDevicePortrait = (id: string) => {
  return server.request({
    method: 'delete',
    url: `/device-portraits/${id}`,
  });
};

// 批量删除设备画像
export const batchDeleteDevicePortraits = (ids: string[]) => {
  return server.request({
    method: 'delete',
    url: '/device-portraits',
    data: {
      ids,
    },
  });
};

// 导入设备画像数据（支持文件上传）
export const importDevicePortraitData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return server.request({
    method: 'post',
    url: '/device-portraits/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
