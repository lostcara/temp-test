// 菜单类型 - 按钮
export const MENU_TYPE_BTN = 'F';

// 菜单类型 - 菜单
export const MENU_TYPE_MENU = 'C';

// 菜单类型 - 目录
export const MENU_TYPE_CATALOG = 'M';

// 顶级菜单 key
export const KEY_TOP_LEVEL_MENU = 0;

// 是否外链 是
export const EXTERNAL_LINKS_YES = '0';

// 是否外链 否
export const EXTERNAL_LINKS_NO = '1';

// 是否缓存 是
export const IS_CACHE_YES = '0';

// 是否缓存 否
export const IS_CACHE_NO = '1';

// 菜单类型 选项
export const MENU_TYPE_OPTIONS = [
  {
    label: '目录',
    value: MENU_TYPE_CATALOG,
  },
  {
    label: '菜单',
    value: MENU_TYPE_MENU,
  },
  {
    label: '按钮',
    value: MENU_TYPE_BTN,
  },
];

// 是否外链 选项
export const EXTERNAL_LINKS_OPTIONS = [
  {
    label: '是',
    value: EXTERNAL_LINKS_YES,
  },
  {
    label: '否',
    value: EXTERNAL_LINKS_NO,
  },
];

// 是否缓存 选项
export const IS_CACHE_OPTIONS = [
  {
    label: '是',
    value: IS_CACHE_YES,
  },
  {
    label: '否',
    value: IS_CACHE_NO,
  },
];
