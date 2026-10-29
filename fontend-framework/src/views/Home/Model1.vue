<script setup lang="ts">
import { Card, Col, Row } from 'ant-design-vue';

import BarCharts from './BarCharts.vue';

const list = [
  {
    label: '异常告警',
    number: 3,
    value: 1,
  },
  {
    label: '风险统计',
    number: 4,
    value: 2,
  },
  {
    label: '新增设备',
    number: 15,
    value: 3,
  },
  {
    label: '待检查设备',
    number: 20,
    value: 4,
  },
  {
    label: '新增风险',
    number: 20,
    value: 5,
  },
];
</script>

<template>
  <div class="alpha-content-card1">
    <Card title="实时数据" style="margin-bottom: 24px">
      <Row class="card-1-row" justify="space-around">
        <Col v-for="item in list" class="card-1-col" :key="item.value">
          <div class="card-1-col-number">{{ item.number }}</div>
          <div class="card-1-col-title">{{ item.label }}</div>
        </Col>
      </Row>
    </Card>
    <Card title="任务统计">
      <BarCharts style="height: 360px" />
    </Card>
  </div>
</template>

<style lang="scss">
.alpha-content-card1 {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;

  .card-1-row {
    width: 100%;
    height: 100%;
    padding: 12px 24px;
    background-color: #f7faff;

    .card-1-col {
      text-align: center;

      .card-1-col-number {
        padding-bottom: 12px;
        font-size: 32px;
      }

      .card-1-col-title {
        font-size: 16px;
      }
    }
  }
}
</style>
