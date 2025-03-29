<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Player from './components/Player.vue';

// const online = nodecg.bundleConfig.event.online;

onMounted(() => {
  const bg = document.getElementById('Background');
  if (bg) bg.style.background = 'unset';
});

onUnmounted(() => {
  const bg = document.getElementById('Background');
  if (bg) bg.style.background = '';
});
</script>

<template>
  <div>
    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderBottom BorderLeft BorderRight"
      :style="{
        left: '119px',
        top: '105px',
        width: '831px',
        height: '720px',
        // background: 'black',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderTop BorderBottom BorderLeft BorderRight"
      :style="{
        left: '970px',
        top: '105px',
        width: '831px',
        height: '720px',
        // background: 'black',
      }"
    />

    <!-- Player 1 -->
    <Player
      :slot-no="0"
      class="Fixed"
      :style="{
        left: '119px',
        top: '845px',
        width: '831px',
      }"
    />

    <!-- Player 2 -->
    <Player
      :slot-no="1"
      class="Fixed"
      :style="{
        left: '970px',
        top: '845px',
        width: '831px',
      }"
    />
  </div>
</template>
