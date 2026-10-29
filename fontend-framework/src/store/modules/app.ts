import { defineStore } from 'pinia';
import { ref } from 'vue';
import { App } from 'ant-design-vue';
import type { MessageInstance } from 'ant-design-vue/es/message/interface';
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm';
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface';
import { THEME_COLOR } from '/@/utils/consts';
import Storage from '/@/utils/Storage';
import { STORAGE_COLLAPSED } from '/@/utils/consts';

const useAppStore = defineStore('app', () => {
  // 主题色
  const themeColor = ref<string>(THEME_COLOR);
  // 菜单收缩
  const collapsed = ref<boolean>(Storage.getCookie(STORAGE_COLLAPSED) === 'true' || false);
  // 国际化
  const locale = ref<'zh' | 'en'>('zh');
  const message = ref<MessageInstance>();
  const notification = ref<NotificationInstance>();
  const modal = ref<Omit<ModalStaticFunctions, 'warn'>>();

  // const staticFunction = App.useApp();
  // message.value = staticFunction.message;
  // modal.value = staticFunction.modal;
  // notification.value = staticFunction.notification;

  (() => {
    const staticFunction = App.useApp();
    message.value = staticFunction.message;
    modal.value = staticFunction.modal;
    notification.value = staticFunction.notification;
  })();

  /**
   * 修改主题色
   * @param color : 主题色;
   */
  const changeThemeColor = (color: string) => {
    themeColor.value = color;
  };

  const toggleCollapsed = () => {
    Storage.setCookie(STORAGE_COLLAPSED, !collapsed.value);
    collapsed.value = !collapsed.value;
  };

  const changeLocale = (value: 'zh' | 'en') => {
    locale.value = value;
  };

  const toggleLocale = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh';
  };

  return {
    themeColor,
    changeThemeColor,
    collapsed,
    toggleCollapsed,
    locale,
    changeLocale,
    toggleLocale,
    message,
    notification,
    modal,
  };
});

export default useAppStore;
