<script setup lang="ts">
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

type Merch = { user: string; productName: string; imgURL: string; } | null;

const merch = computed<Merch>(
  () => mediaBox.data?.alertQueue.find((a) => a.id === mediaBox.data?.current?.mediaUUID)?.data as Merch,
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-if="merch"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.8em', // move to prop?
      padding: '10px',
      'box-sizing': 'border-box',
      'text-align': 'center',
    }"
  >
    <div :style="{ 'margin-right': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ merch.user }}
      </div>
      <div
        :style="{
          'font-size': '0.85em',
        }"
      >
        bought a {{ merch.productName }}
      </div>
    </div>
    <img
      :src="merch.imgURL"
      :style="{
        height: vertical ? '50%' : '65%',
        'max-height': '350px',
        'margin-right': vertical ? 0 : '20px',
        'margin-top': vertical ? '10px' : 0,
      }"
    />
  </div>
</template>
