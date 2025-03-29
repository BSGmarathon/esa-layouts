<script setup lang="ts">
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed } from 'vue';
import Cheer from './components/Cheer.vue';
import Donation from './components/Donation.vue';
import ImageComp from './components/Image.vue';
import Merch from './components/Merch.vue';
import Prize from './components/Prize.vue';
import PrizeGeneric from './components/PrizeGeneric.vue';
import Subscription from './components/Subscription.vue';
import TextElem from './components/Text.vue';
import TherunggMsg from './components/TherunggMsg.vue';

withDefaults(defineProps<{ vertical: boolean, fontSize: number }>(), {
  fontSize: 50,
});

const type = computed(() => {
  switch (mediaBox.data?.current?.type) {
    case 'image':
      return 0;
    case 'prize':
      return 1;
    case 'prize_generic':
      return 2;
    case 'text':
      return 3;
    case 'donation':
      return 4;
    case 'subscription':
      return 5;
    case 'cheer':
      return 6;
    case 'merch':
      return 7;
    case 'therungg':
      return 8;
    default:
      return -1;
  }
});
</script>

<template>
  <div class="Fixed"> <!-- todo: locally store class CSS properties for safety -->
    <div
      v-if="mediaBox.data?.current?.id"
      ref="MediaBox"
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
        'font-size': `${fontSize}px`,
      }"
    >
      <transition name="fade">
        <ImageComp
          v-if="type === 0"
          :key="mediaBox.data.current.id"
          class="Slide"
        />
        <Prize
          v-else-if="type === 1"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <PrizeGeneric
          v-else-if="type === 2"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <TextElem
          v-else-if="type === 3"
          :key="mediaBox.data.current.id"
          class="Slide"
        />
        <Donation
          v-else-if="type === 4"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <Subscription
          v-else-if="type === 5"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <Cheer
          v-else-if="type === 6"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <Merch
          v-else-if="type === 7"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
        <TherunggMsg
          v-else-if="type === 8"
          :key="mediaBox.data.current.id"
          class="Slide"
          :vertical="vertical"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped>
  .Slide {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
