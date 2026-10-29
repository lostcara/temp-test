import server from '/@/utils/request';

// 查询缓存详细
export const getCacheDetails = () => {
  return server.request({
    method: 'get',
    url: '/monitor/cache',
  });
};

// 查询缓存名称列表
export const getCacheNameList = () => {
  return server.request({
    method: 'get',
    url: '/monitor/cache/getNames',
  });
};

// 查询缓存键名列表
export const getCacheKeyList = (cacheName: string) => {
  return server.request({
    method: 'get',
    url: `/monitor/cache/getKeys/${cacheName}`,
  });
};

// 查询缓存内容
export const getCacheValueContent = (cacheName: string, cacheKey: string) => {
  return server.request({
    method: 'get',
    url: `/monitor/cache/getValue/${cacheName}/${cacheKey}`,
  });
};

// 清理指定名称缓存
export const deleteCacheName = (cacheName: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/cache/clearCacheName/${cacheName}`,
  });
};

// 清理指定键名缓存
export const clearCacheKey = (cacheKey: string) => {
  return server.request({
    method: 'delete',
    url: `/monitor/cache/clearCacheKey/${cacheKey}`,
  });
};

// 清理全部缓存
export const clearCacheAll = () => {
  return server.request({
    method: 'delete',
    url: '/monitor/cache/clearCacheAll',
  });
};
