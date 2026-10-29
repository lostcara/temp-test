<script setup lang="ts" name="Matrix">
import type { UploadProps } from 'ant-design-vue';

import { reactive } from 'vue';

import { InboxOutlined } from '@ant-design/icons-vue';
import { Button, Form, FormItem, Space, UploadDragger } from 'ant-design-vue';

import AlphaTable from '/@/components/AlphaTable/index.vue';
import useDownload from '/@/hooks/useDownload';

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };

const formState: any = reactive({
  fileList: [],
});
const { handleDownload } = useDownload();
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 创建一个新的文件对象，直接设置为成功状态
  const customFile = {
    ...file,
    name: file.name,
    status: 'success', // 直接设置为完成状态，不会显示加载动画
    uid: Date.now(),
  };

  formState.fileList = [customFile];
  return false;
};
</script>

<template>
  <AlphaTable :search-flag="false">
    <template #table>
      <Form
        :before-upload="beforeUpload"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        style="width: 640px"
      >
        <FormItem label="威胁报告">
          <UploadDragger
            :file-list="formState.fileList"
            name="file"
            :multiple="true"
            :before-upload="beforeUpload"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">请上传txt文件，大小在60M以内</p>
          </UploadDragger>
        </FormItem>
        <FormItem :wrapper-col="{ offset: 6, span: 18 }">
          <Space>
            <Button type="primary" @click="handleDownload('解析报告')">
              解析
            </Button>
            <Button @click="formState.fileList = []">重置</Button>
          </Space>
        </FormItem>
      </Form>
    </template>
  </AlphaTable>
</template>
<style lang="scss" scoped>
:deep(.ant-upload-list-item-name) {
  color: #52c41a !important; // 使用 Ant Design 的成功色
}

:deep(.ant-upload-list-item-card-actions) {
  .anticon {
    color: rgb(0 0 0 / 45%);
  }
}
</style>
