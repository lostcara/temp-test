import { message } from 'ant-design-vue';
import { MESSAGE_KEY } from '/@/utils/consts';
import { VNode } from 'vue';

export const useMessageKey = () => {
  const messageWithKey = {
    info: (content: string | VNode, duration = 3) => message.info({ content, key: MESSAGE_KEY, duration }),
    success: (content: string | VNode, duration = 3) => message.success({ content, key: MESSAGE_KEY, duration }),
    error: (content: string | VNode, duration = 3) => message.error({ content, key: MESSAGE_KEY, duration }),
    warning: (content: string | VNode, duration = 3) => message.warning({ content, key: MESSAGE_KEY, duration }),
    loading: (content: string | VNode, duration = 3) => message.loading({ content, key: MESSAGE_KEY, duration }),
    open: message.open,
    destroy: message.destroy,
  };
  return {
    messageWithKey,
  };
};

export const { messageWithKey } = useMessageKey();
