<script setup lang="ts">
import type NodeCGTypes from '@nodecg/types';
import { assetsVideos as videos, videoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import { computed, ref } from 'vue';
import { useIntermissionPlayerStore } from '@esa-layouts/dashboard/intermission-player-control/store';

const playerStore = useIntermissionPlayerStore();
const searchTerm = ref<string | null>(null);

function playCount(sum: string): number {
  return videoPlayer.data?.plays?.[sum] || 0;
}

const filteredVideos = computed(() => videos.value
  .filter((v) => {
    const str = (searchTerm.value) ? searchTerm.value.toLowerCase() : '';
    return !str || (str && v.name.toLowerCase().includes(str));
  })
  .map((video) => [playCount(video.sum), video])
  .sort()
  .map((video) => video[1] as NodeCGTypes.AssetFile));
</script>

<template>
  <div>
    <v-toolbar-title>
      Available Videos
    </v-toolbar-title>
    <div :style="{ 'margin-top': '10px' }">
      <span
        v-if="!videos?.length"
        :style="{ 'font-style': 'italic' }"
      >
        Add videos under "Assets" > "esa-layouts" > "Videos".
      </span>
      <template v-else>
        <v-text-field
          v-model="searchTerm"
          filled
          clearable
          label="Search..."
          append-icon="mdi-magnify"
          :messages="`
            ${filteredVideos.length} video${filteredVideos.length === 1 ? '' : 's'} found.
          `"
        />
        <div
          :style="{
            height: '250px',
            'overflow-y': 'scroll',
            'overflow-x': 'hidden',
            margin: 0,
            padding: '10px',
          }"
        >
          <div
            v-for="video in filteredVideos"
            :key="video.sum"
            class="d-flex align-center"
            :value="video.sum"
            :style="{
              margin: '5px',
              'margin-left': 0,
            }"
          >
            <div
              class="d-flex align-center"
              :style="{ 'margin-right': '10px' }"
            >
              <v-btn
                icon
                outlined
                small
                :style="{ 'margin-right': '10px' }"
                @click="playerStore.playlistAdd({ sum: video.sum, commercial: true })"
              >
                <v-icon small>
                  mdi-playlist-plus
                </v-icon>
              </v-btn>
              <v-icon>
                mdi-play
              </v-icon>
              <div :style="{ width: '25px', 'text-align': 'center' }">
                {{ playCount(video.sum) }}
              </div>
            </div>
            <div :title="video.name">
              {{ video.name }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
