<script setup lang="ts">
import { twitchCommercialTimer } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

const percentage = computed(() => Math.min((twitchCommercialTimer.data!.secondsRemaining
  / twitchCommercialTimer.data!.originalDuration) * 100, 100));
</script>

<template>
  <div
    v-if="twitchCommercialTimer.data"
    v-show="percentage > 0"
    class="CommercialTimer Fixed Flex"
    :style="{
      'font-size': '20px',
      background:
        `linear-gradient(to right, rgba(145, 78, 33) ${percentage}%, rgba(207, 119, 59, 0.3) 0)`,
    }"
  >
    Twitch Commercials Running
  </div>
</template>
