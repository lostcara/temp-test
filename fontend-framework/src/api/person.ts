import server from '/@/utils/request';
// 修改密码
export const editPwdData = (data: any) => {
  return server.request({
    data,
    method: 'put',
    url: '/system/user/password',
  });
};
