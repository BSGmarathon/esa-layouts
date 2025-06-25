<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useVideoPlayerStore } from '../store';

const playerStore = useVideoPlayerStore();

const { finishSceneModel } = storeToRefs(playerStore);
</script>

<template>
  <div>
    <v-toolbar-title>
      Target scene on playlist end:
    </v-toolbar-title>

    <v-radio-group
      :style="{ 'margin-top': '5px' }"
      v-model="finishSceneModel"
    >
      <v-radio label="Intermission" value="intermission" />
      <v-radio label="Game Layout" value="gameLayout" />
      <v-radio label="Interview" value="interview" />
    </v-radio-group>
  </div>
</template>
