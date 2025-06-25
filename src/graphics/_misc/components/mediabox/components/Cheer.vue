<script setup lang="ts">
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

type Cheer = { name: string; amount: number; message: string; } | undefined;

const cheer = computed<Cheer>(
  () => mediaBox.data?.alertQueue.find((a) => a.id === mediaBox.data?.current?.mediaUUID)?.data as Cheer,
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-if="cheer"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaWow.png"
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
        {{ cheer.name }}
      </div>
      <div
        :style="{
          'font-size': '0.85em',
          // color: '#ffc90e', // BTRL thing, move to theme!
        }"
      >
        cheered {{ cheer.amount }} bits!
      </div>
      <div
        v-if="cheer.message"
        :style="{
          'font-size': '0.6em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ cheer.message }}
      </div>
    </div>
  </div>
</template>
