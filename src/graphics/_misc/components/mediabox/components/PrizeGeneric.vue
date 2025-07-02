<script setup lang="ts">
import { mediaBox, prizes } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

const prizesUrl = nodecg.bundleConfig?.tracker?.prizesUrl || 'prizes.esamarathon.com';
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
    />
    <div :style="{ 'margin-left': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '0.7em',
          color: 'white', // move to theme!
        }"
      >
        Want a chance to win prizes like...
      </div>
      <div :style="{ 'font-size': '0.875em' }">
        {{ prize.name }}?
      </div>
      <div
        v-if="prize.provided"
        :style="{ 'font-size': '0.875em' }"
      >
        provided by <strong>{{ prize.provided }}</strong>
      </div>
      <div
        :style="{
          'font-size': '0.875em',
          color: 'lightgrey', // move to theme!
        }"
      >
        Find more @ {{ prizesUrl }}
      </div>
    </div>
  </div>
</template>
