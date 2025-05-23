<script setup lang="ts">
import SpeedDial from './SpeedDial.vue';

withDefaults(
  defineProps<{ id: string, msg: string, seconds: number }>(),
  {
    msg: 'Message?',
    seconds: 25,
  },
);
</script>

<template>
  <v-card class="pa-2">
    <SpeedDial :id="id" />
    <div>
      <span class="font-weight-bold">Type:</span>
      Generic Message
    </div>
    <div class="d-flex">
      <div class="font-weight-bold mr-1">Message:</div>
      <div :style="{ 'white-space': 'pre-wrap' }">{{ msg }}</div>
    </div>
    <div>
      <span class="font-weight-bold">Length:</span>
      {{ seconds }} seconds
    </div>
  </v-card>
</template>
