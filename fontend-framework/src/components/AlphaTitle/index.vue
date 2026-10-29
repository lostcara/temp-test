<script setup lang="ts" name="AlphaTitle">
defineProps({
  title: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <a-row class="alpha-title">
    <a-col flex="auto">
      <div class="vertical-bar">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
      </div>
    </a-col>
    <a-col>
      <slot></slot>
    </a-col>
  </a-row>
</template>

<style lang="scss">
.alpha-title {
  line-height: 32px;

  .vertical-bar {
    padding-left: 12px;
    font-family: 'AlibabaPuHuiTi-2-65-Medium';
    font-size: 18px;

    &::before {
      position: absolute;
      top: 7px;
      left: 0;
      width: 4px;
      height: 18px;
      content: '';
      background: #2f54eb;
      border-radius: 8px;
    }
  }
}
</style>
