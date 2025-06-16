<script setup lang="ts">
import Draggable from 'vuedraggable';
import { storeToRefs } from 'pinia';
import { assetsVideos as videos } from '@esa-layouts/browser_shared/replicant_store';
import MediaCard from '../../_misc/components/MediaCard.vue';
import { useVideoPlayerStore } from '../store';

const playerStore = useVideoPlayerStore();
const { newPlaylist, localEdits } = storeToRefs(playerStore);

function getName(sum?: string): string | undefined {
  return videos.value.find((a) => a.sum === sum)?.name;
}

function playlistRemove(i: number) {
  playerStore.newPlaylist.splice(i, 1);
  playerStore.onLocalEdits();
}

</script>

<template>
  <div>
    <v-toolbar-title>
      Playlist
    </v-toolbar-title>
    <v-alert
      v-show="localEdits"
      type="warning"
      dense
      :style="{ 'margin-top': '5px' }"
    >
      Local changes have been made.
    </v-alert>
    <MediaCard
      v-if="!newPlaylist.length"
      :style="{ 'font-style': 'italic' }"
    >
      Add videos using the list above.
    </MediaCard>
    <draggable v-model="newPlaylist">
      <template #item="{ element: videoSum, index: i }">
        <MediaCard
          :key="`${videoSum}_${i}`"
          class="d-flex align-center"
        >
          <div
            class="d-flex justify-center flex-grow-1"
            :style="{
            'overflow': 'hidden',
            'font-style': 'italic',
          }"
          >
            {{ getName(videoSum) || 'Could not find video name.' }}
          </div>
          <v-icon @click="playlistRemove(i)" class="mr-1">
            mdi-delete
          </v-icon>
        </MediaCard>
      </template>
    </draggable>
  </div>
</template>
