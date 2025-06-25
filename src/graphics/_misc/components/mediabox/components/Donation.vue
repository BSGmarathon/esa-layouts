<script setup lang="ts">
import { formatUSD } from '@esa-layouts/browser_shared/helpers';
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

type Donation = { name: string; amount: number; comment?: string | undefined; } | null;

const donation = computed<Donation>(
  () => mediaBox.data?.alertQueue.find((a) => a.id === mediaBox.data?.current?.mediaUUID)?.data as Donation,
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-if="donation"
    ref="Donation"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaDonate.png"
      :style="{ 'margin-bottom': vertical ? '10px' : 0 }"
    />
    <div
      class="FlexColumn"
      :style="{ 'margin-left': vertical ? 0 : '20px' }"
    >
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ donation.name }}
      </div>
      <div
        :style="{
          'font-size': '0.85em',
          // color: '#ffc90e' // BTRL thing, move to theme!
        }"
      >
        donated {{ formatUSD(donation.amount) }}
      </div>
      <div
        v-if="donation.comment"
        :style="{
          'font-size': '0.6em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ `${donation.comment.slice(0, 500)}${donation.comment.length > 500 ? '...' : ''}` }}
      </div>
    </div>
  </div>
</template>
