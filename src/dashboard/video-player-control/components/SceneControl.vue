<script lang="ts" setup>
import { fullScreenVideoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { storeToRefs } from 'pinia';
import type { FullScreenVideoPlayer } from '@esa-layouts/types/schemas';
import { useVideoPlayerStore } from '../store';

const playerStore = useVideoPlayerStore();

const { newFinishScene } = storeToRefs(playerStore);

function onRadioChange(newVal: string | null) {
  playerStore.setFinishScene(newVal as FullScreenVideoPlayer['finishScene']);
}
</script>

<template>
  <div>
    <v-toolbar-title>
      Target scene on playlist end:
    </v-toolbar-title>

    <v-radio-group
      :style="{ 'margin-top': '5px' }"
      :model-value="newFinishScene"
      @update:modelValue="onRadioChange"
    >
      <v-radio label="Intermission" value="intermission" />
      <v-radio label="Game Layout" value="gameLayout" />
      <v-radio label="Interview" value="interview" />
    </v-radio-group>
  </div>
</template>
