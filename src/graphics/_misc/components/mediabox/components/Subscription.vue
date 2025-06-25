<script setup lang="ts">
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

type Sub = { systemMsg: string; message?: string | undefined; } | null;

const subscription = computed<Sub>(
  () => mediaBox.data?.alertQueue.find((a) => a.id === mediaBox.data?.current?.mediaUUID)?.data as Sub,
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-if="subscription"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./esaHype.png"
      :style="{ 'margin-bottom': vertical ? '10px' : 0 }"
    />
    <div
      class="FlexColumn"
      :style="{ 'margin-left': vertical ? 0 : '10px' }"
    >
      <div
        :style="{
          'font-size': '0.8em',
          color: 'white', // move to theme!
        }"
      >
        {{ subscription.systemMsg }}
      </div>
      <div
        v-if="subscription.message"
        :style="{
          'font-size': '0.7em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ subscription.message }}
      </div>
    </div>
  </div>
</template>
