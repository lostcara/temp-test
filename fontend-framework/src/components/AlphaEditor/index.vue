<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import '@wangeditor/editor/dist/css/style.css';

const props = defineProps({
  modelValue: {
    default: '',
    type: String,
  },
});

const emits = defineEmits(['update:modelValue']);

const mode = 'default';
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('<p>hello</p>');
const initFlag = ref<boolean>(true);

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 编辑器回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleChange = (editor: any) => {
  emits('update:modelValue', editor.getHtml());
};

const handleDestroyed = (editor: any) => {
  // eslint-disable-next-line no-console
  console.log('destroyed', editor);
};

// const customAlert = (info, type) => {
//   alert(`【自定义提示】${type} - ${info}`);
// };

// const customPaste = (editor, event, callback) => {
//   console.log('ClipboardEvent 粘贴事件对象', event);

//   // 自定义插入内容
//   editor.insertText('xxx');

//   // 返回值（注意，vue 事件的返回值，不能用 return）
//   callback(false); // 返回 false ，阻止默认粘贴行为
//   // callback(true) // 返回 true ，继续默认的粘贴行为
// };

// 向编辑器新增内容
// const insertText = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;

//   editor.insertText('hello world');
// };

// 转换 Html
// const printHtml = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   console.log(editor.getHtml());
// };

// 无法编辑模式
// const disable = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.disable();
// };

watch(
  () => props.modelValue,
  (newval) => {
    if (initFlag.value) {
      // eslint-disable-next-line no-console
      console.log(newval, '第一次');
      valueHtml.value = newval;
      initFlag.value = false;
    }
  },
  { immediate: true },
);

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) return;

  editor.destroy();
});
</script>

<template>
  <div class="alpha-editor-border-bottom">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
      class="alpha-editor-border-bottom"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      style="height: 400px; overflow-y: hidden"
      @on-created="handleCreated"
      @on-change="handleChange"
      @on-destroyed="handleDestroyed"
    />
  </div>
</template>

<style lang="scss">
.alpha-editor-border-bottom {
  border: 1px solid #d9d9d9;
}
</style>
