<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Badge, Card, Col, List, ListItem, Row } from 'ant-design-vue';
import axios from 'axios';

const dataSource = ref([]);
const loading = ref(false);

const loadData = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/data.json');
    dataSource.value = response.data.data;
  } catch (error_) {
    console.error('加载JSON失败:', error_);
  } finally {
    loading.value = false;
  }
};

setInterval(() => {
  loadData();
}, 100);

// 组件挂载时启动定时器
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="alpha-content-card5">
    <Card title="异常及风险" class="w-h-100 card-style">
      <template #extra><a href="#">更多</a></template>
      <List item-layout="horizontal" :data-source="dataSource">
        <template #renderItem="{ item }">
          <ListItem style="width: 100%; cursor: pointer">
            <Row style="width: 100%" @click="item.status = '0'">
              <Col style="font-weight: bold">
                <Badge v-if="item.status === '1'" color="#F43C3C">
                  <template #text> [未读] </template>
                </Badge>
                <div v-else>
                  <span style="padding-left: 18px; color: #2f54eb">
                    [已读]
                  </span>
                </div>
              </Col>
              <Col flex="1">
                <span style="padding-left: 8px">{{ item.msg }}</span>
              </Col>
              <Col>{{ item.time }}</Col>
            </Row>
          </ListItem>
        </template>
      </List>
    </Card>
  </div>
</template>

<style lang="scss">
.alpha-content-card5 {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;

  .card-style {
    height: 794px;
    overflow: auto;
    -ms-overflow-style: none; // IE, Edge
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Edge
    }
  }
}
</style>
