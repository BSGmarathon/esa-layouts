<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import { useHead } from '@vueuse/head';

useHead({ title: 'Media box only' });
</script>

<template>
  <div>
    <div id="Background" />
    <div
      id="Layout"
      class="Flex"
      :style="{
        'flex-direction': 'column',
      }"
    >
      <!-- Media Box -->
      <MediaBox
        :font-size="130"
        :style="{
          left: '0px',
          top: '0px',
          width: '100vw',
          height: '100vh',
          padding: '0 200px',
          'box-sizing': 'border-box',
        }"
      />
    </div>
  </div>
</template>
