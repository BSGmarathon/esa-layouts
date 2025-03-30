<script setup lang="ts">
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

defineProps<{
  vertical: boolean;
}>();

const msg = computed(
  () => (mediaBox.data?.alertQueue
    .find((a) => a.id === mediaBox.data?.current?.mediaUUID)?.data as any).msg,
);
</script>

<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="msg"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./therungg.png"
      :style="{
        'margin-bottom': vertical ? '10px' : 0,
        'margin-right': !vertical ? '10px' : 0,
        height: '70%',
        // width: '50%',
        'object-fit': 'contain',
      }"
    >
    <div :style="{ color: 'white' }">
      {{ msg }}
    </div>
  </div>
</template>
