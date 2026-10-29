<script setup lang="ts">
import { Col, Row } from 'ant-design-vue';

import Model1 from './Model1.vue';
import Model2 from './Model2.vue';
import Model3 from './Model3.vue';
import Model4 from './Model4.vue';
import Model5 from './Model5.vue';
</script>

<template>
  <div class="home-container">
    <Row :gutter="[16, 16]">
      <Col :span="16">
        <Row :gutter="[16, 16]">
          <Col :span="24">
            <Model1 />
          </Col>
          <Col :span="12">
            <Model3 />
          </Col>
          <Col :span="12">
            <Model4 />
          </Col>
        </Row>
      </Col>
      <Col :span="8">
        <Row :gutter="[16, 16]">
          <Col :span="24">
            <Model2 />
          </Col>
          <Col :span="24">
            <Model5 />
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<style lang="scss">
.home-container {
  width: 100%;
  height: 100%;
}
</style>
