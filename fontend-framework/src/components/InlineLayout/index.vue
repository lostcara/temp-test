<script setup lang="ts" name="InLineLayout">
defineProps({
  label: {
    default: '',
    type: String,
  },
  wrapper: {
    default: '',
    type: String,
  },
});
</script>

<template>
  <span>
    <slot name="label">
      <span>{{ label }}</span>
    </slot>
    <span class="padding-right-8 padding-left-4">:</span>
    <slot name="wrapper">
      <span :title="wrapper">{{ wrapper }}</span>
    </slot>
  </span>
</template>
