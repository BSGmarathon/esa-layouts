<script setup lang="ts">
import { assetsVideos as videos, videoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

const name = computed(() => videos.value.find((a) => a.sum === videoPlayer.data?.current)?.name);

function emergencyStop(): void {
  nodecg.sendMessage('stopIntermissionPlayerEarly');
}
</script>

<template>
  <div
    v-if="videoPlayer.data"
    v-show="videoPlayer.data.playing"
    :style="{ 'text-align': 'center' }"
  >
    <span class="font-weight-bold">Currently Playing:</span>
    <br/><span v-if="name">{{ name }}</span>
    <span v-else>Unknown (Usually Commercial w/o Video)</span>
    <v-btn color="red" class="mt-2" @click="emergencyStop" block>Emergency Stop</v-btn>
  </div>
</template>
