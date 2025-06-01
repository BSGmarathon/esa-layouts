<script setup lang="ts">
import { musicData } from '@esa-layouts/browser_shared/replicant_store';
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { computed, onMounted } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

const emit = defineEmits<{ end: [] }>();
const { seconds = 25 } = defineProps<{ seconds: number }>();
const trackInformation = computed(() => {
  const info = [
    musicData.data?.track?.title,
    musicData.data?.track?.artist,
  ].filter(Boolean);

  return info.length ? info.join(' - ') : undefined;
});

onMounted(async () => {
  await waitForReplicant(musicData);

  // Skip display if no track is playing
  if (!musicData.data!.playing || !trackInformation.value) {
    emit('end');
    return;
  }

  await wait(seconds * 1000); // Wait the specified length.
  emit('end');
});
</script>

<template>
  <div
    class="Flex"
    :style="{
      'font-size': '33px',
      'white-space': 'nowrap',
      'font-weight': 500,
      'text-align': 'center',
      // 'line-height': '100%',
    }"
  >
    <span v-if="musicData.data?.playing" :style="{ 'white-space': 'pre' }">🎵 {{ trackInformation }}</span>
    <span v-else :style="{ 'white-space': 'pre' }">⏸ {{ trackInformation }}</span>
  </div>
</template>
