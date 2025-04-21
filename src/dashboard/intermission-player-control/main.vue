<script setup lang="ts">
import clone from 'clone';
import { videoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { watch } from 'vue';
import { useHead } from '@vueuse/head';
import AvailableVideos from './components/AvailableVideos.vue';
import Playlist from './components/Playlist.vue';
import CurrentVideoInfo from './components/CurrentVideoInfo.vue';
import { useIntermissionPlayerStore } from './store';

useHead({ title: 'Intermission Player control' });

let localEditTimeout: number | undefined;
const playerStore = useIntermissionPlayerStore();

function resetLocalPlaylist() {
  playerStore.newPlaylist = videoPlayer.data?.playlist ?? [];
  playerStore.localEdits = false;
}

watch(() => playerStore.newPlaylist, () => {
  playerStore.localEdits = true;

  clearTimeout(localEditTimeout);

  // Reset the playlist after 30 seconds
  // we're using the window accessor here because of typescript BS
  localEditTimeout = window.setTimeout(() => {
    resetLocalPlaylist();
  }, 30 * 1000);
}, { deep: true });

async function save() {
  playerStore.disableSave = true;

  videoPlayer.data!.playlist = clone(playerStore.newPlaylist);
  await new Promise((res) => { setTimeout(res, 1000); }); // Fake 1s wait
  playerStore.disableSave = false;
  clearTimeout(localEditTimeout);
  playerStore.localEdits = false;
}
</script>

<template>
  <v-app v-if="videoPlayer.data">
    <AvailableVideos />
    <Playlist :style="{ 'margin-top': '20px' }" />

    <!-- Save/Refresh Buttons -->
    <div
      class="d-flex"
      :style="{ 'margin-top': '20px' }"
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
