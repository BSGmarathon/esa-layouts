<script setup lang="ts">
import { RtmpFeed } from '@esa-layouts/types/schemas';
import { computed } from 'vue';

const { value } = defineProps<{ value: RtmpFeed }>();

const instances = [
  {
    prefix: 'eu',
    name: 'Europe',
  },
  {
    prefix: 'na',
    name: 'North-America',
  },
];
const canEdit = computed(() => value.editAllowed && value.enabled);
</script>

<template>
  <div>
    <!-- shhhhhht -->
    <!-- eslint-disable vue/no-mutating-props -->
    <v-checkbox
      :disabled="!value.editAllowed"
      v-model="value.enabled"
      :label="`Feed ${value.feedIndex}`"
    />
    <v-row>
      <v-col cols="5">
        <v-select
          :disabled="!canEdit"
          v-model="value.server"
          label="Instance"
          item-text="name"
          item-value="prefix"
          :items="instances"
          persistent-hint
          single-line
        />
      </v-col>
      <v-col>
        <v-text-field label="Stream key" v-model="value.streamKey" filled :disabled="!canEdit" />
      </v-col>
    </v-row>
    <v-text-field
      label="RTMP url"
      :value="`rtmp://${value.server}.bsgmarathon.com/live`"
      readonly
      filled
      :disabled="!canEdit" />
  </div>
</template>
