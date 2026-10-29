import server from '/@/utils/request';

export interface ThreatInferenceQueryParams {
  alarmNumber?: string;
  deviceName?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface ThreatInferenceItem {
  id?: string;
  alarmNumber: string;
  businessName: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  anomalyType: string;
  riskLevel: string;
  alarmTime: string;
  status: '待查' | '已修复';
  statusLabel?: string;
  statusColor?: string;
}

// 获取威胁推理列表
export const fetchThreatInferenceList = (
  params: ThreatInferenceQueryParams,
) => {
  return server.request({
    url: '/threat-inferences',
    method: 'get',
    params,
  });
};

// 获取威胁推理详情
export const fetchThreatInferenceDetail = (id: string) => {
  return server.request({
    method: 'get',
    url: `/threat-inferences/${id}`,
  });
};

// 创建威胁推理记录
export const createThreatInference = (
  data: Partial<ThreatInferenceItem>,
) => {
  return server.request({
    method: 'post',
    url: '/threat-inferences',
    data,
  });
};

// 更新威胁推理记录
export const updateThreatInference = (
  id: string,
  data: Partial<ThreatInferenceItem>,
) => {
  return server.request({
    method: 'put',
    url: `/threat-inferences/${id}`,
    data,
  });
};

// 导入威胁推理数据（支持文件上传）
export const importThreatInferenceData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return server.request({
    method: 'post',
    url: '/threat-inferences/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除威胁推理记录
export const deleteThreatInference = (id: string) => {
  return server.request({
    method: 'delete',
    url: `/threat-inferences/${id}`,
  });
};

// 批量删除威胁推理记录
export const batchDeleteThreatInferences = (ids: string[]) => {
  return server.request({
    method: 'delete',
    url: '/threat-inferences',
    data: {
      ids,
    },
  });
};

