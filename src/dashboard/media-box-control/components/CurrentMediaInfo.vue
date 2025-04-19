<script setup lang="ts">
import { mediaBox as settings } from '@esa-layouts/browser_shared/replicant_store';
import { MediaBox } from '../../../types';
import { getMediaDetails, isAlertType } from './shared';

function mediaLength(media: MediaBox.ActiveElem): number {
  if (media && isAlertType(media.type)) {
    return 15; // Alerts have a hardcoded 15 second length for now.
  }
  return settings.data?.rotationApplicable
    .find((i) => i.id === media?.id)?.seconds || 0;
}

function timeRemaining(media: MediaBox.ActiveElem): number {
  return Math.round(mediaLength(media) - ((media?.timeElapsed || 0) / 1000));
}

function position(media: MediaBox.ActiveElem): number {
  const index = media?.index;
  return typeof index === 'number' ? index + 1 : -1;
}
</script>

<template>
  <div v-if="settings.data">
    <div class="Status">
      <span
        v-if="!settings.data.current"
        :style="{ 'font-style': 'italic' }"
      >
        No media currently displaying.
      </span>
      <template v-else-if="settings.data.current">
        <span class="font-weight-bold">Current:</span>
        <template v-if="isAlertType(settings.data!.current.type)">
          <span :style="{ 'text-transform': 'capitalize' }">
            {{ settings.data.current.type }}
          </span> Alert
        </template>
        <template v-else>
          {{ getMediaDetails(settings.data.current).name }}
        </template>
        <br>
        <template v-if="!isAlertType(settings.data.current.type)">
          (position {{ position(settings.data.current) }}/{{ settings.data.rotationApplicable.length }},
        </template>
        <span v-else>(</span>{{
          timeRemaining(settings.data.current) }}/{{ mediaLength(settings.data.current) }}s left)
      </template>
    </div>
    <div
      v-if="settings.data.paused"
      class="Status"
    >
      <span class="font-weight-bold">Paused:</span> {{ getMediaDetails(settings.data.paused).name }}
      <br>(position {{ position(settings.data.paused) }}/{{ settings.data.rotationApplicable.length }},
      {{ timeRemaining(settings.data.paused) }}/{{ mediaLength(settings.data.paused) }}s left)
    </div>
  </div>
</template>

<style scoped>
  .Status {
    text-align: center;
    padding: 5px;
  }
</style>
