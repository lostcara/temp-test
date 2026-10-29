// 角色权限 admin
export const PERMISSIONS_ROLE_ADMIN = 'admin';

// 字符权限 admin
export const PERMISSIONS_CHAR_ADMIN = '*:*:*';

// 默认主题色
export const THEME_COLOR = '#2F54EB';

// message的key
export const MESSAGE_KEY = '1zxcas123asd';

// storage的key
export const STORAGE_TOKEN = import.meta.env.VITE_STORAGE_TOKEN || 'token';

// storage的 collapsed
export const STORAGE_COLLAPSED = import.meta.env.VITE_STORAGE_COLLAPSED || 'theme_collapsed';

// development(开发环境)
export const MODE_DEVELOPMENT = 'development';

// production(生产环境)
export const MODE_PRODUCTION = 'production';

// 菜单项的父级
export const MENU_ROUTER_NAME = 'Layout';

// 路由 - 白名单
export const WHITE_ROUTER_LIST = ['/login'];

// 路由NAME - 404
export const ROUTE_NAME_404 = 'NotFound';

// 路由NAME - 无权限
export const ROUTE_NAME_NO_PERMISSION = 'NoPermission';

// 表格分页 - 每页数量
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

// 成功颜色
export const COLOR_SUCCESS = '#52C41A';
// 错误颜色
export const COLOR_ERROR = '#F04438';
// 禁止颜色
export const COLOR_DISABLED = '#F43C3C';
// 普通颜色
export const COLOR_DEFAULT = '#2F54EB';
// 警告颜色
export const COLOR_WARN = '#FAAD14';
// 忽略颜色
export const COLOR_IGNORED = '#D9D9D9';

// 状态 全局 正常（’0‘）
export const STATUS_DEFAULT_NORMAL = '0';

// 状态 全局 停用（’1‘）
export const STATUS_DEFAULT_STOP = '1';

// 选项 - ALL (value)
export const OPTION_ALL_VALUE = 'all';

// 选项 - ALL
export const OPTION_ALL = {
  value: 'all',
  label: '全部'
};

// Tag选项颜色
export const TAG_COLOR_OPTIONS = [
  {
    label: '主要',
    value: 'primary',
    color: COLOR_DEFAULT
  },
  {
    label: '危险',
    value: 'danger',
    color: COLOR_ERROR,
  },
  {
    label: '警告',
    value: 'warning',
    color: COLOR_WARN,
  },
  {
    label: '成功',
    value: 'success',
    color: COLOR_SUCCESS,
  },
  {
    label: '信息',
    value: 'info',
    color: COLOR_IGNORED,
  },
  // {
  //   label: '默认',
  //   value: 'default',
  //   color: '',
  // },
];
