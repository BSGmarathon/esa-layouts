<script setup lang="ts">
import {
  currentRunDelay,
  obsData,
  serverTimestamp,
  timer,
  videoPlayer,
} from '@esa-layouts/browser_shared/replicant_store';
import { computed, ref } from 'vue';

const obsConfig = nodecg.bundleConfig.obs;
const evtConfig = nodecg.bundleConfig.event;
const intermissionScenes = [
  obsConfig.names.scenes.commercials,
  obsConfig.names.scenes.intermission,
  obsConfig.names.scenes.intermissionPlayer,
  obsConfig.names.scenes.intermissionCrowd,
  obsConfig.names.scenes.countdown,
];
const gameLayoutPreviewToggle = ref(false);

const disableIntermission = computed(() => (obsData.data?.transitioning
  || obsData.data?.disableTransitioning
  || !!intermissionScenes.find((s) => obsData.data?.scene?.startsWith(s))
  || ['running', 'paused'].includes(timer.value?.state || '')));

function disableButton(scene: string): boolean {
  return obsData.data!.transitioning
    || scene === obsData.data!.scene
    || obsData.data!.disableTransitioning;
}

function startIntermission(): void {
  nodecg.sendMessage('startIntermission');
}

function changeScene(scene: string): void {
  nodecg.sendMessage('obsChangeScene', { scene });
}
</script>

<template>
  <v-app>
    <div v-if="!obsConfig.enabled" :style="{ 'font-style': 'italic' }">
      This feature is not enabled.
    </div>
    <div v-else-if="!obsData.data.connected" :style="{ 'font-style': 'italic' }">
      OBS connection currently disconnected.
    </div>
    <template v-else>
      <div class="mb-1">
        <span
          v-if="obsData.data.transitionTimestamp > serverTimestamp.data"
          class="red--text font-weight-bold"
        >
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning in {{
            ((obsData.data.transitionTimestamp - serverTimestamp.data) / 1000).toFixed(1) }}s
        </span>
        <span v-else-if="obsData.data.transitioning" class="red--text font-weight-bold">
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning
        </span>
        <span
          v-else-if="videoPlayer.data.estimatedFinishTimestamp > serverTimestamp.data"
          class="red--text font-weight-bold"
        >
          <v-icon color="red">mdi-alert</v-icon>
          Playlist will finish in ~{{
            ((videoPlayer.data.estimatedFinishTimestamp - serverTimestamp.data) / 1000).toFixed(1) }}s
        </span>
        <span v-else-if="obsData.data.disableTransitioning" class="red--text font-weight-bold">
          <v-icon color="red">mdi-alert</v-icon>
          Transitioning Disabled
        </span>
        <span v-else class="font-italic">
          Not Currently Transitioning
        </span>
      </div>
      <div class="mb-1">
        Streaming Status:
        <span v-if="obsData.data.streaming" :style="{ 'font-weight': 'bold', color: '#58CF00' }">
          Connected
        </span>
        <span v-else :style="{ 'font-weight': 'bold', color: '#FF5F5C' }">
          Disconnected
        </span>
      </div>
      <v-btn
        @click="startIntermission"
        :disabled="disableIntermission"
      >
        Transition to Intermission (<strong><em>ADS</em></strong>)
        <template v-if="currentRunDelay.audio">
          ({{ (currentRunDelay.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <v-btn
        class="mt-1"
        @click="changeScene(obsConfig.names.scenes.gameLayout)"
        :disabled="disableButton(obsConfig.names.scenes.gameLayout)"
      >
        Transition to Run
        <template v-if="currentRunDelay.audio">
          ({{ (currentRunDelay.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <div class="d-flex mt-3 mb-1">
        Change to Specific Scene:
      </div>
      <v-btn
        v-for="(scene, i) in obsData.sceneList"
        :key="i"
        :class="{ 'mt-1': i !== 0 }"
        :disabled="disableButton(scene)"
        @click="changeScene(scene)"
      >
        {{ scene }}
        <template
          v-if="scene !== obsData.data.scene && (currentRunDelay.data.audio
          && (scene === obsConfig.names.scenes.gameLayout
          || (scene !== obsConfig.names.scenes.gameLayout
          && obsData.data.scene === obsConfig.names.scenes.gameLayout)))"
        >
          ({{ (currentRunDelay.data.audio / 1000).toFixed(1) }}s delay)
        </template>
      </v-btn>
      <template v-if="evtConfig.online && obsData.data.gameLayoutScreenshot && gameLayoutPreviewToggle">
        <div class="mt-3 mb-1">
          "Game Layout" Preview (refreshes every second):
        </div>
        <img :src="obsData.data.gameLayoutScreenshot" :style="{ width: '100%' }">
      </template>
      <v-switch
        v-if="evtConfig.online"
        v-model="gameLayoutPreviewToggle"
        class="ma-2 mb-0"
        hide-details
        label="Toggle &quot;Game Layout&quot; Preview"
        inset
      />
    </template>
  </v-app>
</template>
