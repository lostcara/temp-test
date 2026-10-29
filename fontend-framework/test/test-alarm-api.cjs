/**
 * 测试告警接口
 * 使用方法: node test-alarm-api.cjs
 */

const http = require('http');

// 测试配置
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// 辅助函数：发送 HTTP 请求
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed,
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data,
            });
          }
        });
      },
    );

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// 测试函数
async function testAlarmAPI() {
  console.log('🚀 开始测试告警接口...\n');

  try {
    // 1. 测试健康检查
    console.log('1️⃣ 测试健康检查接口...');
    const healthCheck = await request(`${BASE_URL}/health`);
    console.log('✅ 健康检查:', JSON.stringify(healthCheck.data, null, 2));
    console.log('');

    // 2. 测试获取告警列表（基础查询）
    console.log('2️⃣ 测试获取告警列表（基础查询）...');
    const list1 = await request(`${API_BASE}/alarms?page=1&pageSize=10`);
    console.log('✅ 状态码:', list1.status);
    console.log('✅ 响应数据:', JSON.stringify(list1.data, null, 2));
    console.log('');

    // 3. 测试带参数的查询
    console.log('3️⃣ 测试带参数的查询（告警单号）...');
    const list2 = await request(
      `${API_BASE}/alarms?page=1&pageSize=10&alarmNumber=ALM`,
    );
    console.log('✅ 状态码:', list2.status);
    console.log('✅ 响应数据:', JSON.stringify(list2.data, null, 2));
    console.log('');

    // 4. 测试状态筛选
    console.log('4️⃣ 测试状态筛选（pending）...');
    const list3 = await request(
      `${API_BASE}/alarms?page=1&pageSize=10&status=pending`,
    );
    console.log('✅ 状态码:', list3.status);
    console.log('✅ 响应数据:', JSON.stringify(list3.data, null, 2));
    console.log('');

    // 5. 测试设备名称模糊查询
    console.log('5️⃣ 测试设备名称模糊查询...');
    const list4 = await request(
      `${API_BASE}/alarms?page=1&pageSize=10&deviceName=设备`,
    );
    console.log('✅ 状态码:', list4.status);
    console.log('✅ 响应数据:', JSON.stringify(list4.data, null, 2));
    console.log('');

    // 6. 测试按状态获取告警
    console.log('6️⃣ 测试按状态获取告警（pending）...');
    const byStatus = await request(`${API_BASE}/alarms/status/pending`);
    console.log('✅ 状态码:', byStatus.status);
    console.log('✅ 响应数据:', JSON.stringify(byStatus.data, null, 2));
    console.log('');

    // 7. 测试状态汇总
    console.log('7️⃣ 测试状态汇总...');
    const summary = await request(`${API_BASE}/alarms/statuses/summary`);
    console.log('✅ 状态码:', summary.status);
    console.log('✅ 响应数据:', JSON.stringify(summary.data, null, 2));
    console.log('');

    console.log('✅✅✅ 所有接口测试完成！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 提示: 请确保后端服务已启动 (http://localhost:3000)');
    }
    process.exit(1);
  }
}

// 运行测试
testAlarmAPI();
