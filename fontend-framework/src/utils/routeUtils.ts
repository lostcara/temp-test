import { markRaw } from 'vue';

// import Home from '/@/views/Home/index.vue';
// import Cache from '/@/views/Monitor/Cache/index.vue';
// import CacheList from '/@/views/Monitor/CacheList/index.vue';
// import CronJob from '/@/views/Monitor/CronJob/index.vue';
// import OnlineUser from '/@/views/Monitor/OnlineUser/index.vue';
// import SchedulingLog from '/@/views/Monitor/SchedulingLog/index.vue';
// import Server from '/@/views/Monitor/Server/index.vue';
// import ActionLog from '/@/views/System/ActionLog/index.vue';
// import Config from '/@/views/System/Config/index.vue';
// import Department from '/@/views/System/Department/index.vue';
// import Dictionary from '/@/views/System/Dictionary/index.vue';
// import DictionaryDetails from '/@/views/System/DictionaryDetails/index.vue';
// import LoginLog from '/@/views/System/LoginLog/index.vue';
// import Menu from '/@/views/System/Menu/index.vue';
import NoRoute from '/@/views/System/NoRoute/index.vue';
// import Notice from '/@/views/System/Notice/index.vue';
// import Post from '/@/views/System/Post/index.vue';
// import Role from '/@/views/System/Role/index.vue';
// import User from '/@/views/System/User/index.vue';

export const routerPermissions = {
  // 'DataStatistics/QuotaData': markRaw(Home),
  // 'monitor/cache/index': markRaw(Cache),
  // 'monitor/job/index': markRaw(CronJob),
  // 'monitor/joblog/index': markRaw(SchedulingLog),
  // 'monitor/logininfor/index': markRaw(LoginLog),
  // 'monitor/online/index': markRaw(OnlineUser),
  // 'monitor/operlog/index': markRaw(ActionLog),
  // 'monitor/server/index': markRaw(Server),
  // 'system/config/index': markRaw(Config),
  // 'system/dept/index': markRaw(Department),
  // 'system/dict/index': markRaw(Dictionary),
  // 'system/dictDetails/index': markRaw(DictionaryDetails),
  // 'system/menu/index': markRaw(Menu),
  // 'system/notice/index': markRaw(Notice),
  // 'system/post/index': markRaw(Post),
  // 'system/role/index': markRaw(Role),
  // 'system/user/index': markRaw(User),
  // 'monitor/cache/list': markRaw(CacheList),
};

export const mateRouteComponent = (routeKey: string, componentObj: any) => {
  return componentObj[routeKey] || markRaw(NoRoute);
};
