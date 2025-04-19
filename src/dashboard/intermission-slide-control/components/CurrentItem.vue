<script setup lang="ts">
import { computed } from 'vue';
import { assetsIntermissionSlides, intermissionSlides } from '@esa-layouts/browser_shared/replicant_store';

const current = computed(() => intermissionSlides.data?.current);
const rotationLength = computed(() => intermissionSlides.data?.rotation.length);
const currentPosition = computed(
  () => intermissionSlides.data?.rotation.findIndex((r) => r.id === current.value?.id),
);
const name = computed(() => {
  const curr = current.value;

  if (curr?.type === 'Media') {
    return assetsIntermissionSlides.value.find((a) => a.sum === curr?.mediaUUID)?.name || '';
  }

  if (curr?.type === 'UpcomingRuns') {
    return 'Upcoming Runs';
  }

  if (curr?.type === 'RandomBid') {
    return 'Random Bid';
  }

  if (curr?.type === 'RandomPrize') {
    return 'Random Prize';
  }

  return '?';
});
</script>

<template>
  <div class="text-center">
    <template v-if="current">
      <span class="font-weight-bold">Current:</span>
      {{ name }}
      <br><span class="font-weight-bold">Position:</span>
      {{ currentPosition + 1 || '?' }}/{{ rotationLength }}
    </template>
    <template v-else>
      No slide current displaying.
    </template>
  </div>
</template>
