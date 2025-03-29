<script setup lang="ts">
defineProps<{
  useDash: boolean;
}>();
</script>

<style lang="scss" scoped>
.dash {
  background-color: purple;
}
</style>

<template>
  <div :class="{ 'has-dash': !!$slots.dash }">
    <div class="dash" v-if="$slots.dash">
      <slot name="dash"/>
    </div>
    <slot/>
  </div>
</template>
