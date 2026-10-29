import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  const root = process.cwd();

  const pathResolve = (pathname: string) => resolve(root, '.', pathname);

  const iconDirs = [resolve(process.cwd(), 'src/assets/icon')];

  const env = loadEnv(mode, root, '');

  // 代理目标地址配置
  const proxyTarget = env.VITE_APP_BASE_API || 'http://localhost:3000';

  // 开发环境打印代理配置信息
  if (mode === 'development') {
    console.log('\n🔧 Vite 代理配置:');
    console.log('  - 代理路径: /api');
    console.log('  - 目标地址:', proxyTarget);
    console.log('  - 完整示例: /api/alarms ->', `${proxyTarget}/api/alarms`);
    console.log(
      '  - 环境变量 VITE_APP_BASE_API:',
      env.VITE_APP_BASE_API || '(未设置，使用默认值)',
    );
    console.log('');
  }

  return {
    optimizeDeps: {
      include: ['xlsx'],
    },
    server: {
      host: true,
      port: 8080,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          // 不去掉 /api 前缀，因为后端路由需要 /api 前缀
          // rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            // 打印代理目标地址
            if (mode === 'development') {
              console.log('📡 代理服务器已配置:', {
                target: options.target,
                path: '/api',
              });
            }
            proxy.on('error', (err, _req, res) => {
              console.error('❌ 代理错误:', err);
              console.error('   目标地址:', options.target);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              const targetUrl = `${options.target}${proxyReq.path}`;
              console.log(
                `🔄 代理请求: ${req.method} ${req.url} -> ${targetUrl}`,
              );
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              if (mode === 'development') {
                console.log(
                  `✅ 代理响应: ${req.url} -> 状态码: ${proxyRes.statusCode}`,
                );
              }
            });
          },
        },
        // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
        // '^/fallback/.*': {
        //   target: 'http://jsonplaceholder.typicode.com',
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/fallback/, ''),
        // },
        // 使用 proxy 实例
        // '/api1': {
        //   target: 'http://jsonplaceholder.typicode.com',
        //   changeOrigin: true,
        //   configure: (proxy, options) => {
        //     // proxy 是 'http-proxy' 的实例
        //     console.log(proxy, options);
        //   },
        // },
      },
    },
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    build: {
      // 去除生产环境的console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // rollupOptions: {
      //   output: {
      //     // 最小化拆分包
      //     manualChunks(id) {
      //       if (id.includes('node_modules')) {
      //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
      //       }
      //       // 将svg单独打包
      //       // if (id.includes('svg-icons-register')) {
      //       //   return 'svg-icons';
      //       // }
      //     },
      //   },
      // },
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs,
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',

        /**
         * 自定义插入位置
         * @default: body-last
         */
        // inject: 'body-last' | 'body-first',

        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        customDomId: '__svg__icons__dom__',
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
      }),
      // visualizer(), // 分析打包后产物插件
    ],
  };
});
