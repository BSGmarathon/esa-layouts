<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import type { Countdown } from '@esa-layouts/types/schemas';
import { computed } from 'vue';
import { msToTimeStr } from '@esa-layouts/browser_shared/helpers';

const countdown = useReplicant<Countdown>('countdown', 'esa-layouts');

const remaining = computed(() => countdown?.data?.remaining ?? 0);

const currentCountdown = computed(() => {
  const seconds = Math.round(remaining.value / 1000);
  if (seconds >= 60 * 60 * 10) {
    return msToTimeStr(seconds * 1000);
  }

  if (seconds >= (60 * 60)) {
    return msToTimeStr(seconds * 1000).slice(1);
  }

  return msToTimeStr(seconds * 1000).slice(3);
});
</script>

<template>
  <div :style="{ 'text-align': 'center' }">
    <div :style="{ 'font-size': '70px' }">
      <span v-if="remaining > 0">
        Event Starts In
      </span>
      <span v-else>
        Event Starts Soon
      </span>
    </div>
    <div
      :style="{
        'font-size': '200px',
        'margin-top': '-0.2em',
        color: 'white',
        'font-weight': '600',
        opacity: remaining > 0 ? 1 : 0,
      }"
    >
      {{ currentCountdown }}
    </div>
  </div>
</template>
