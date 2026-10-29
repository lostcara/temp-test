import { createApp } from 'vue';

import App from './App.vue';

import 'virtual:svg-icons-register';

import '/@/assets/style/index.css';

import directive from '/@/directive';
import { setupCustomComponents } from '/@/plugins';
import router from '/@/router';
import { setupStore } from '/@/store';

const bootstrap = () => {
  const app = createApp(App);
  setupCustomComponents(app);
  app.use(router);
  // 配置 Store
  setupStore(app);
  // 添加自定义指令
  directive(app);

  app.mount('#app');
};

bootstrap();
