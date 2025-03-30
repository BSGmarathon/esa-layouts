<script setup lang="ts">
import { formatUSD } from '@esa-layouts/browser_shared/helpers';
import { mediaBox, prizes } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

const prize = computed(
  () => prizes.data?.find((s) => s.id.toString() === mediaBox.data?.current?.mediaUUID),
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-if="prize"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '1em', // move to prop?
      padding: '10px',
      'box-sizing': 'border-box',
      'text-align': 'center',
    }"
  >
    <img
      :src="prize.image"
      :style="{
        height: vertical ? '80%' : '100%',
        'object-fit': 'contain',
        'max-height': '350px',
        'margin-left': vertical ? 0 : '20px',
        'margin-bottom': vertical ? '10px' : 0,
      }"
    >
    <div :style="{ 'margin-left': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '0.7em',
          color: 'white', // move to theme!
        }"
      >
        Prize Available
      </div>
      <div :style="{ 'font-size': '1em' }">
        {{ prize.name }}
      </div>
      <div
        v-if="prize.provided"
        :style="{ 'font-size': '0.875em' }"
      >
        provided by {{ prize.provided }}
      </div>
      <div
        :style="{
          'font-size': '0.75em',
          color: 'lightgrey', // move to theme!
        }"
      >
        Minimum donation amount: {{ formatUSD(prize.minimumBid) }}
      </div>
    </div>
  </div>
</template>
