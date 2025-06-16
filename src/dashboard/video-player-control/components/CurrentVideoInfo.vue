<script setup lang="ts">
import { assetsVideos as videos, fullScreenVideoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';

const name = computed(() => videos.value.find((a) => a.sum === fullScreenVideoPlayer.data?.current)?.name);

function emergencyStop(): void {
  nodecg.sendMessage('stopFullScreenVideoPlayerEarly');
}
</script>

<template>
  <div
    v-if="fullScreenVideoPlayer.data"
    v-show="fullScreenVideoPlayer.data.playing"
    :style="{ 'text-align': 'center' }"
  >
    <span class="font-weight-bold">Currently Playing:</span>
    <br><span v-if="name">{{ name }}</span>
    <span v-else>Unknown (Usually Commercial w/o Video)</span>
    <v-btn color="red" class="mt-2" @click="emergencyStop" block>Emergency Stop</v-btn>
  </div>
</template>
