<script setup lang="ts">
import Draggable from 'vuedraggable';
import MediaCard from '../../_misc/components/MediaCard.vue';
import { useIntermissionPlayerStore } from '../store';
import { assetsVideos as videos } from '@esa-layouts/browser_shared/replicant_store';
import { storeToRefs } from 'pinia';

const playerStore = useIntermissionPlayerStore();
const { newPlaylist, localEdits } = storeToRefs(playerStore);

function getName(sum?: string): string | undefined {
  return videos.value.find((a) => a.sum === sum)?.name;
}

function playlistUpdateLength(i: number, length: number) {
  playerStore.newPlaylist[i].length = length;
}

function playlistRemove(i: number) {
  playerStore.newPlaylist.splice(i, 1);
}

// TODO: implement when needed
// watch(() => videoPlayer.data, () => {
//   if (!playerStore.localEdits) {
//     playlistRefresh();
//   }
// }, { immediate: true });
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
      <template #item="{ element: { sum, length, commercial }, index: i }">
        <MediaCard
          :key="`${sum}_${i}`"
          class="d-flex align-center"
        >
          <v-text-field
            :value="length"
            type="number"
            hide-details
            outlined
            dense
            spellcheck="false"
            autocomplete="off"
            :style="{ 'max-width': '75px' }"
            :step="`${commercial ? '30' : '1'}`"
            min="0"
            @input="playlistUpdateLength(i, $event)"
          />
          <div
            class="d-flex justify-center flex-grow-1"
            :style="{
            'overflow': 'hidden',
            'font-style': !getName(sum) ? 'italic' : undefined,
          }"
          >
            <template v-if="sum">
              {{ getName(sum) || 'Could not find video name.' }}
            </template>
            <template v-else-if="commercial">
              Commercial w/o Video
            </template>
            <template v-else>
              Wait Block
            </template>
          </div>
          <v-icon @click="playlistRemove(i)" class="mr-1">
            mdi-delete
          </v-icon>
        </MediaCard>
      </template>
    </draggable>
    <v-btn block class="mt-3" @click="playerStore.playlistAdd({ commercial: true })">
      Add Commercial w/o Video to Playlist
    </v-btn>
    <v-btn block class="mt-3" @click="playerStore.playlistAdd({ commercial: false })">
      Add Wait Block to Playlist
    </v-btn>
  </div>
</template>
