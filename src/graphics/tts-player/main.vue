<script setup lang="ts">
import { useHead } from '@vueuse/head';
import TextToSpeech from './components/TextToSpeech.vue';

useHead({ title: 'TTS player' });
</script>

<template>
  <TextToSpeech />
</template>
