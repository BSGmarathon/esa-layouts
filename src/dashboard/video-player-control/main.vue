<script setup lang="ts">
import { fullScreenVideoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { watch } from 'vue';
import { useHead } from '@vueuse/head';
import AvailableVideos from './components/AvailableVideos.vue';
import Playlist from './components/Playlist.vue';
import CurrentVideoInfo from './components/CurrentVideoInfo.vue';
import { useVideoPlayerStore } from './store';
import SceneControl from './components/SceneControl.vue';

useHead({ title: 'Full Screen Player control' });

const playerStore = useVideoPlayerStore();

function resetLocalPlaylist() {
  playerStore.resetLocalPlaylist();
}

watch(() => fullScreenVideoPlayer.data, () => {
  if (!playerStore.localEdits) {
    playerStore.resetLocalPlaylist();
  }
}, { immediate: true });

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

    <SceneControl :style="{ 'margin-top': '20px' }" />

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
