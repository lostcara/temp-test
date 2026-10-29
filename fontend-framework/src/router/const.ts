import { RouteRecordRaw } from 'vue-router';

import Portrait from '/@/views/Equipment/Portrait/index.vue';
import Resolution from '/@/views/Equipment/Resolution/index.vue';
import Home from '/@/views/Home/index.vue';
import Knowledge from '/@/views/Security/Knowledge/index.vue';
import Compare from '/@/views/Security/Compare/index.vue';
import Model from '/@/views/Security/Model/index.vue';
import PersonCenter from '/@/views/System/PersonCenter/index.vue';
import Alarm from '/@/views/SystemState/Alarm/index.vue';
import Device from '/@/views/SystemState/Device/index.vue';
import Inference from '/@/views/Threat/Inference/index.vue';
import Matrix from '/@/views/Threat/Matrix/index.vue';

export const constRoutes: RouteRecordRaw[] = [
  {
    component: Home,
    meta: {
      hidden: true,
      title: '首页',
    },
    name: 'home',
    path: 'home',
  },
  {
    meta: {
      title: '系统状态',
    },
    name: 'SystemState',
    path: 'system-state',
    redirect: '/alarm',
    children: [
      {
        component: Alarm,
        meta: {
          title: '告警信息',
        },
        name: 'Alarm',
        path: 'alarm',
      },
      {
        component: Device,
        meta: {
          title: '设备信息',
        },
        name: 'Device',
        path: 'device',
      },
    ],
  },
  {
    meta: {
      title: '设备管理',
    },
    name: 'Equipment',
    path: 'equipment',
    redirect: '/portrait',
    children: [
      {
        component: Portrait,
        meta: {
          title: '设备画像',
        },
        name: 'Portrait',
        path: 'portrait',
      },
      {
        component: Resolution,
        meta: {
          title: '标识解析',
        },
        name: 'Resolution',
        path: 'resolution',
      },
    ],
  },
  {
    meta: {
      title: '威胁管理',
    },
    name: 'Threat',
    path: 'threat',
    redirect: '/inference',
    children: [
      {
        component: Inference,
        meta: {
          title: '威胁推理',
        },
        name: 'Inference',
        path: 'inference',
      },
      {
        component: Matrix,
        meta: {
          title: '风险矩阵',
        },
        name: 'Matrix',
        path: 'matrix',
      },
    ],
  },
  {
    meta: {
      title: '安全信息',
    },
    name: 'Security',
    path: 'security',
    redirect: '/knowledge',
    children: [
      {
        component: Knowledge,
        meta: {
          title: '相关知识',
        },
        name: 'Knowledge',
        path: 'knowledge',
      },
      {
        component: Compare,
        meta: {
          title: '相似匹配',
        },
        name: 'Compare',
        path: 'compare',
      },
      {
        component: Model,
        meta: {
          title: '相关模型',
        },
        name: 'Model',
        path: 'model',
      },
    ],
  },
];

export const publicRoutes: RouteRecordRaw[] = [
  {
    component: PersonCenter,
    meta: {
      hidden: true,
      title: '个人中心',
    },
    name: 'personCenter',
    path: 'person-center',
  },
];
