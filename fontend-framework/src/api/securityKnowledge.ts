import server from '/@/utils/request';

export interface SecurityKnowledgeQueryParams {
  knowledgeNumber?: string;
  knowledgeType?: string;
  address?: string;
  page?: number;
  pageSize?: number;
}

export interface SecurityKnowledgeItem {
  id?: string;
  knowledgeNumber: string;
  businessName: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  anomalyType: string;
  riskLevel: string;
  status: '待查' | '已修复';
  detailInfo: string;
  statusLabel?: string;
  statusColor?: string;
}

// 获取安全知识列表
export const fetchSecurityKnowledgeList = (
  params: SecurityKnowledgeQueryParams,
) => {
  return server.request({
    url: '/security-knowledges',
    method: 'get',
    params,
  });
};

// 获取安全知识详情
export const fetchSecurityKnowledgeDetail = (id: string) => {
  return server.request({
    method: 'get',
    url: `/security-knowledges/${id}`,
  });
};

// 创建安全知识记录
export const createSecurityKnowledge = (
  data: Partial<SecurityKnowledgeItem>,
) => {
  return server.request({
    method: 'post',
    url: '/security-knowledges',
    data,
  });
};

// 更新安全知识记录
export const updateSecurityKnowledge = (
  id: string,
  data: Partial<SecurityKnowledgeItem>,
) => {
  return server.request({
    method: 'put',
    url: `/security-knowledges/${id}`,
    data,
  });
};

// 导入安全知识数据（支持文件上传）
export const importSecurityKnowledgeData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return server.request({
    method: 'post',
    url: '/security-knowledges/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除安全知识记录
export const deleteSecurityKnowledge = (id: string) => {
  return server.request({
    method: 'delete',
    url: `/security-knowledges/${id}`,
  });
};

// 批量删除安全知识记录
export const batchDeleteSecurityKnowledges = (ids: string[]) => {
  return server.request({
    method: 'delete',
    url: '/security-knowledges',
    data: {
      ids,
    },
  });
};

