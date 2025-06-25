<script setup lang="ts">
import { musicData } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

const { hideIcon } = defineProps<{
  hideIcon: boolean;
}>();

const trackInformation = computed(() => {
  const currData = musicData?.data;
  const info = [
    currData?.track?.title,
    currData?.track?.artist,
  ].filter(Boolean);

  return info.length ? info.join(' - ') : undefined;
});
</script>

<template>
  <div
    v-if="true"
    class="Flex MusicTrack"
    :style="{ height: '100%' }"
  >
    <div
      v-if="!hideIcon"
      class="Flex MCat"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        padding: '5px'
      }"
    >
      <img
        src="./Music.png"
        :style="{ height: '85%', padding: '0 5px' }"
      />
    </div>
    <div
      v-if="trackInformation"
      :style="{ padding: '0 15px' }"
    >
      {{ trackInformation }}
    </div>
  </div>
</template>
