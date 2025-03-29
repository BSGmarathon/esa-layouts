<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { getZoomAmountCSS } from '@esa-layouts/graphics/_misc/helpers';
import MusicTrack from '@esa-layouts/graphics/intermission/components/MusicTrack.vue';
import Countdown from './components/Countdown.vue';
import Game from './game/game.vue';

useHead({ title: 'Countdown' });

const zoom = getZoomAmountCSS();
</script>

<template>
  <div id="Countdown" class="Flex" :style="{ zoom }">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex bsglayout countdownLayout"
      :style="{
        'flex-direction': 'column',
        height: '100%',
      }"
    >
      <Countdown class="textOrangeShadow" :style="{ 'margin-top': '50px' }" />

      <div class="game-container">
        <Game />
      </div>

      <div class="musicContainer">
        <MusicTrack hide-icon class="music" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#Countdown {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  color: var(--text-color);
  #Layout {
    position: relative;
    justify-content: center;
    align-items: center;

    div div:last-child {
      margin-top: 0 !important;
      letter-spacing: .5rem;
    }
  }
}

.game-container {
  position: absolute;
  left: 27px;
  top: 600px;
}

.musicContainer {
  position: absolute;
  width: 672px;
  height: 100px;
  left: 57px;
  top: 148px;
  font-size: 20px;
  //background: rgba(0, 0, 0, 0.5);
}
</style>
