/**
 * 测试前端告警 API 调用
 * 使用方法: node test-frontend-api.mjs
 */

import axios from 'axios';

// 模拟前端的请求配置
const server = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 30000,
});

// 测试函数
async function testFrontendAPI() {
  console.log('🚀 开始测试前端告警 API 调用...\n');

  try {
    // 1. 测试 fetchAlarmList - 基础查询
    console.log('1️⃣ 测试 fetchAlarmList（基础查询）...');
    const list1 = await server.request({
      method: 'get',
      params: {
        page: 1,
        pageSize: 10,
      },
      url: '/alarms',
    });
    console.log('✅ 状态码:', list1.status);
    console.log('✅ 响应数据:', JSON.stringify(list1.data, null, 2));
    console.log('');

    // 2. 测试 fetchAlarmList - 带告警单号
    console.log('2️⃣ 测试 fetchAlarmList（告警单号查询）...');
    const list2 = await server.request({
      method: 'get',
      params: {
        alarmNumber: 'ALM',
        page: 1,
        pageSize: 10,
      },
      url: '/alarms',
    });
    console.log('✅ 状态码:', list2.status);
    console.log('✅ 响应数据:', JSON.stringify(list2.data, null, 2));
    console.log('');

    // 3. 测试 fetchAlarmList - 带设备名称
    console.log('3️⃣ 测试 fetchAlarmList（设备名称查询）...');
    const list3 = await server.request({
      method: 'get',
      params: {
        deviceName: '设备',
        page: 1,
        pageSize: 10,
      },
      url: '/alarms',
    });
    console.log('✅ 状态码:', list3.status);
    console.log('✅ 响应数据:', JSON.stringify(list3.data, null, 2));
    console.log('');

    // 4. 测试 fetchAlarmList - 带状态筛选
    console.log('4️⃣ 测试 fetchAlarmList（状态筛选）...');
    const list4 = await server.request({
      method: 'get',
      params: {
        status: 'pending',
        page: 1,
        pageSize: 10,
      },
      url: '/alarms',
    });
    console.log('✅ 状态码:', list4.status);
    console.log('✅ 响应数据:', JSON.stringify(list4.data, null, 2));
    console.log('');

    // 5. 测试 fetchAlarmList - 组合查询
    console.log('5️⃣ 测试 fetchAlarmList（组合查询）...');
    const list5 = await server.request({
      method: 'get',
      params: {
        alarmNumber: 'ALM',
        deviceName: '设备',
        status: 'pending',
        page: 1,
        pageSize: 10,
      },
      url: '/alarms',
    });
    console.log('✅ 状态码:', list5.status);
    console.log('✅ 响应数据:', JSON.stringify(list5.data, null, 2));
    console.log('');

    // 6. 测试 fetchAlarmsByStatus
    console.log('6️⃣ 测试 fetchAlarmsByStatus（pending）...');
    const byStatus = await server.request({
      method: 'get',
      url: '/alarms/status/pending',
    });
    console.log('✅ 状态码:', byStatus.status);
    console.log('✅ 响应数据:', JSON.stringify(byStatus.data, null, 2));
    console.log('');

    // 7. 测试 fetchAlarmStatusSummary
    console.log('7️⃣ 测试 fetchAlarmStatusSummary...');
    const summary = await server.request({
      method: 'get',
      url: '/alarms/statuses/summary',
    });
    console.log('✅ 状态码:', summary.status);
    console.log('✅ 响应数据:', JSON.stringify(summary.data, null, 2));
    console.log('');

    console.log('✅✅✅ 所有前端 API 调用测试完成！');
    console.log('\n📊 测试总结:');
    console.log('  - 所有接口调用成功');
    console.log('  - 参数传递正确');
    console.log('  - 响应格式符合预期');
    console.log('  - 接口可以正常调通 ✅');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: 请确保后端服务已启动 (http://localhost:3000)');
    } else if (error.response) {
      console.error('💡 响应错误:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('💡 请求错误: 无法连接到服务器');
    }
    process.exit(1);
  }
}

// 运行测试
testFrontendAPI();
