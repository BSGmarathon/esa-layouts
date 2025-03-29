<script setup lang="ts">
import LayoutBase from './esaw24-base.vue';

const { thisEvent } = nodecg.bundleConfig.event;
</script>

<template>
  <LayoutBase
    :camera-height="thisEvent === 2 ? `550px` : undefined"
    participants-zoom="0.85"
    participants-border-bottom="0px"
  />
</template>
