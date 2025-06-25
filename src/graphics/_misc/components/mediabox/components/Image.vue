<script setup lang="ts">
import { assetsMediaBoxImages, mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

const url = computed(() => {
  const asset = assetsMediaBoxImages.value.find((s) => s.sum === mediaBox.data?.current?.mediaUUID);

  return asset?.url;
});
</script>

<template>
  <img
    v-show="url"
    :src="url"
    :style="{
      'object-fit': 'contain',
      padding: '30px',
      'box-sizing': 'border-box',
    }"
  />
</template>
