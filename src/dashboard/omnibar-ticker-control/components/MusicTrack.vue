<script setup lang="ts">
import SpeedDial from './SpeedDial.vue';

withDefaults(
  defineProps<{ id: string, seconds: number }>(),
  {
    seconds: 25,
  },
);
</script>

<template>
  <v-card class="pa-2">
    <SpeedDial :id="id" />
    <div>
      <span class="font-weight-bold">Type:</span>
      Current song
    </div>
    <div>
      <span class="font-weight-bold">Length:</span>
      {{ seconds }} seconds
    </div>
  </v-card>
</template>
