import server from '/@/utils/request';

// 查询部门列表
export const getDeptDataByPage = (params: any) => {
  return server.request({
    method: 'get',
    params,
    url: '/system/dept/list',
  });
};

// 查询部门列表（排除节点）
export const listDeptExcludeChild = (deptId: string) => {
  return server.request({
    method: 'get',
    url: `/system/dept/list/exclude/${deptId}`,
  });
};

// 查询部门详细
export const getDeptDataItem = (deptId: string) => {
  return server.request({
    method: 'get',
    url: `/system/dept/${deptId}`,
  });
};

// 新增部门
export const addDeptData = (data: any) => {
  return server.request({
    data,
    method: 'post',
    url: '/system/dept',
  });
};

// 修改部门
export const editDeptData = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/system/dept',
  });
};

// 删除部门
export const deleteDeptData = (deptId: any) => {
  return server.request({
    method: 'delete',
    url: `/system/dept/${deptId}`,
  });
};
