<script setup lang="ts">
import { fullScreenVideoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { watch } from 'vue';
import { useHead } from '@vueuse/head';
import type { FullScreenVideoPlayer } from '@esa-layouts/types/schemas';
import AvailableVideos from './components/AvailableVideos.vue';
import Playlist from './components/Playlist.vue';
import CurrentVideoInfo from './components/CurrentVideoInfo.vue';
import { useVideoPlayerStore } from './store';
import { storeToRefs } from 'pinia';

useHead({ title: 'Full Screen Player control' });

const playerStore = useVideoPlayerStore();

const { newFinishScene } = storeToRefs(playerStore);

function resetLocalPlaylist() {
  playerStore.$patch({
    newPlaylist: fullScreenVideoPlayer.data?.playlist ?? [],
    localEdits: false,
  });
}

// watch(() => playerStore.newPlaylist, () => {
//   playerStore.localEdits = true;
// }, { deep: true });

watch(() => fullScreenVideoPlayer.data, () => {
  if (!playerStore.localEdits) {
    playerStore.resetLocalPlaylist();
  }
}, { immediate: true });

function onRadioChange(newVal: string | null) {
  playerStore.setFinishScene(newVal as FullScreenVideoPlayer['finishScene']);
}

async function save() {
  if (!fullScreenVideoPlayer.data) {
    return;
  }

  await playerStore.save();
}
</script>

<template>
  <v-app v-if="fullScreenVideoPlayer.data">
    <AvailableVideos />
    <Playlist :style="{ 'margin-top': '20px' }" />

   <!-- TODO: move to own component -->
    <div
      class="d-flex"
      :style="{ 'margin-top': '10px' }"
    >
      <v-radio-group :model-value="newFinishScene" @update:modelValue="onRadioChange">
        <v-radio label="Intermission" value="intermission" />
        <v-radio label="Game Layout" value="gameLayout" />
        <v-radio label="Interview" value="interview" />
      </v-radio-group>
    </div>

    <!-- Save/Refresh Buttons -->
    <div
      class="d-flex"
      :style="{ 'margin-top': '10px' }"
    >
      <v-btn
        class="flex-grow-1"
        :loading="playerStore.disableSave"
        :disabled="playerStore.disableSave"
        @click="save()"
      >
        Save
      </v-btn>
      <v-tooltip left>
        <template v-slot:activator="{ targetRef }">
          <v-btn
            :style="{ 'margin-left': '5px' }"
            @click="resetLocalPlaylist()"
            v-on="targetRef"
          >
            <v-icon>
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>
        <span>Revert Local Changes</span>
      </v-tooltip>
    </div>

    <CurrentVideoInfo :style="{ 'margin-top': '10px' }" />
  </v-app>
</template>
