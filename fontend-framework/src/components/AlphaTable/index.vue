<script setup lang="ts" name="AlphaTable">
defineProps({
  searchFlag: {
    default: true,
    type: Boolean,
  },
});
</script>

<template>
  <div class="alpha-table">
    <div v-if="searchFlag" class="alpha-table-header">
      <slot name="search"></slot>
    </div>
    <div class="alpha-table-content">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.alpha-table {
  &-header {
    padding: 16px 24px;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 8px;
  }

  &-content {
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
  }
}
</style>
