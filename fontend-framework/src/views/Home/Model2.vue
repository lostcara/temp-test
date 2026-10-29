<script setup lang="ts">
import { Card, Col, Row } from 'ant-design-vue';

import IMG_1 from './img1.png';
import IMG_2 from './img2.png';
import IMG_4 from './img4.png';
import IMG_5 from './img5.png';
import IMG_3 from './ing3.png';

const list = [
  {
    label: '模型原理',
    number: IMG_1,
    value: 1,
  },
  {
    label: '模型数据',
    number: IMG_2,
    value: 2,
  },
  {
    label: '模型特征',
    number: IMG_3,
    value: 3,
  },
  {
    label: '告警信息',
    number: IMG_4,
    value: 4,
  },
  {
    label: '风险管理',
    number: IMG_4,
    value: 5,
  },
  {
    label: '设备画像',
    number: IMG_5,
    value: 6,
  },
];
</script>

<template>
  <div class="alpha-content-card2">
    <Card title="常用功能" style="margin-bottom: 24px">
      <Row class="card-2-row">
        <Col
          v-for="(item, index) in list"
          class="card-2-col"
          :span="8"
          :key="item.value"
          :style="{ paddingBottom: index < 3 ? '18px' : '' }"
        >
          <div class="card-2-col-number">
            <img :src="item.number" alt="" />
          </div>
          <div class="card-2-col-title">{{ item.label }}</div>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<style lang="scss">
.alpha-content-card2 {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;

  .card-2-row {
    width: 100%;
    height: 100%;
    padding: 12px 24px;

    .card-2-col {
      text-align: center;

      .card-2-col-title {
        font-size: 16px;
      }
    }
  }
}
</style>
