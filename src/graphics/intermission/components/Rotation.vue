<script setup lang="ts">
import { computed } from 'vue';
import { intermissionSlides } from '@esa-layouts/browser_shared/replicant_store';
import Bid from './Rotation/Bid.vue';
import Media from './Rotation/Media.vue';
import Prize from './Rotation/Prize.vue';
import UpcomingRuns from './Rotation/UpcomingRuns.vue';

const current = computed(() => intermissionSlides.data!.current);

async function showNextSlide(): Promise<void> {
  await nodecg.sendMessage('intermissionSlidesShowNext');
}
</script>

<template>
  <div class="Fixed">
    <div
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
      }"
    >
      <transition name="fade">
        <UpcomingRuns
          v-if="current?.type === 'UpcomingRuns'"
          :key="`${current.id}_UpcomingRuns`"
          class="Slide"
          @end="showNextSlide()"
        />
        <Media
          v-else-if="current?.type === 'Media'"
          :key="`${current.id}_Media`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
        />
        <Bid
          v-else-if="current?.type === 'RandomBid'"
          :key="`${current.id}_RandomBid`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
        />
        <Prize
          v-else-if="current?.type === 'RandomPrize'"
          :key="`${current.id}_RandomPrize`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
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
