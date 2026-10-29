<script setup lang="ts" name="RoleForm">
import type { UploadProps } from 'ant-design-vue';

import { ref } from 'vue';

import { InboxOutlined } from '@ant-design/icons-vue';
import { Checkbox, Form, FormItem, Modal, UploadDragger } from 'ant-design-vue';

import { importUserData } from '/@/api/user';
import { messageWithKey } from '/@/hooks/useMessageKey';

const props = defineProps({
  afterSave: {
    required: true,
    type: Function,
  },
});

const fileList = ref<any[]>([]);

const checked = ref<boolean>(false);
const visible = ref<boolean>(false);

const title = '导入';

const handleCancel = () => {
  checked.value = false;
  fileList.value = [];
};

const showModal = () => {
  visible.value = true;
};

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  fileList.value = [file];
  return false;
};

const handleRemove: UploadProps['onRemove'] = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = [...fileList.value];
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const handleOk = async () => {
  onSubmit();
};

const onSubmit = async () => {
  const formData = new FormData();
  formData.append('file', fileList.value[fileList.value.length - 1]);
  const { code, msg }: any = await importUserData(formData, checked.value);
  if (code === 200) {
    messageWithKey.success(msg);
    if (props.afterSave) {
      props.afterSave();
    }
    visible.value = false;
    handleCancel();
  } else {
    messageWithKey.error(msg);
  }
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :width="640"
    :title="title"
    :ok-button-props="{ disabled: fileList.length === 0 }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <FormItem label="更新方式">
        <Checkbox v-model:checked="checked">
          是否更新已经存在的用户数据
        </Checkbox>
      </FormItem>
    </Form>
    <UploadDragger
      :file-list="fileList"
      name="file"
      :multiple="true"
      :before-upload="beforeUpload"
      @remove="handleRemove"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p class="ant-upload-text">
        把文件拖入指定区域，完成上传，同样支持点击上传
      </p>
      <p class="ant-upload-hint">支持单次</p>
    </UploadDragger>
  </Modal>
</template>
