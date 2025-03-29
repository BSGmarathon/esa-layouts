<script setup lang="ts">
import { onMounted } from 'vue';

const audio = new Audio();

onMounted(() => {
  nodecg.listenFor('ttsToRead', (url) => {
    audio.src = url;
    audio.play();
  });
});
</script>

<template>
  <div :style="{ display: 'none' }" />
</template>
