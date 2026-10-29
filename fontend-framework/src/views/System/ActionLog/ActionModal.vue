<script setup lang="ts" name="UserForm">
import { ref } from 'vue';

import { Descriptions, DescriptionsItem, Modal, Tag } from 'ant-design-vue';

import useDictType from '/@/hooks/useDictType';
import { showOptionsOfAttr } from '/@/utils/common';

const list = [
  {
    field: 'title',
    label: '操作模块',
    span: 1,
    value: '',
  },
  {
    field: 'operIp',
    label: '请求地址',
    span: 2,
    value: '',
  },
  {
    field: 'operName',
    label: '登录信息',
    span: 1,
    value: '',
  },
  {
    field: 'requestMethod',
    label: '请求方式',
    span: 2,
    value: '',
  },
  {
    field: 'method',
    label: '操作方法',
    span: 3,
    value: '',
  },
  {
    field: 'operParam',
    label: '请求参数',
    span: 3,
    value: '',
  },
  {
    field: 'jsonResult',
    label: '返回参数',
    span: 3,
    value: '',
  },
  {
    field: 'status',
    label: '操作状态',
    span: 1,
    value: '',
  },
  {
    field: 'costTime',
    label: '消耗时间',
    span: 1,
    value: '',
  },
  {
    field: 'operTime',
    label: '操作时间',
    span: 1,
    value: '',
  },
];

const { dictType } = useDictType(['sys_oper_type', 'sys_common_status']);

const visible = ref<boolean>(false);
const title = '操作详情';
const dataList = ref<any[]>([...list]);

const showModal = async (record: any) => {
  dataList.value = dataList.value.map((k) => {
    if (k.field === 'operName') {
      return {
        ...k,
        value: `${record?.operName} / ${record?.operIp} / ${record.operLocation}`,
      };
    }
    return {
      ...k,
      value: record[k.field],
    };
  });
  visible.value = true;
};

const cancel = () => {
  dataList.value = list;
  visible.value = false;
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :title="title"
    destroy-on-close
    :width="840"
    :footer="null"
    @cancel="cancel"
  >
    <Descriptions bordered layout="vertical">
      <DescriptionsItem
        v-for="item in dataList"
        :key="item.field"
        :label="item.label"
        :span="item.span"
      >
        <template v-if="item.field === 'status'">
          <Tag
            :color="
              showOptionsOfAttr(
                String(item.value),
                dictType.sys_common_status,
                'color',
              )
            "
          >
            {{
              showOptionsOfAttr(
                String(item.value),
                dictType.sys_common_status,
                'label',
              )
            }}
          </Tag>
        </template>
        <template v-else-if="item.field === 'costTime'">
          {{ `${item.value}毫秒` }}
        </template>
        <template v-else>
          {{ item.value }}
        </template>
      </DescriptionsItem>
    </Descriptions>
  </Modal>
</template>
