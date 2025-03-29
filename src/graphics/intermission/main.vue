<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import { useHead } from '@vueuse/head';
import { useIntermissionStore } from './store';
import UpcomingRun from './components/UpcomingRun.vue';
import Rotation from './components/Rotation.vue';
import { getZoomAmountCSS } from '../_misc/helpers';
import CommercialTimer from './components/CommercialTimer.vue';
import DonationReader from './components/DonationReader.vue';
import MusicTrack from './components/MusicTrack.vue';
import DonationTotal from './components/DonationTotal.vue';

useHead({ title: 'Intermission' });

const zoom = getZoomAmountCSS();
const clipPath = 'unset';

const intermissionStore = useIntermissionStore();
</script>

<template>
  <div id="Intermission" class="bsglayout" :style="{ zoom }">
    <div
      id="Background"
      :style="{ 'clip-path': clipPath }"
    />
    <div id="Layout">
    <!-- Logo linksboven-->
      <div
        class="Logo Fixed"
        :style="{
          left: '53px',
          top: '43px',
          width: '609px',
          height: '276px',
        }"
      />

      <!-- Commercial Timer -->
      <CommercialTimer
        :style="{
          left: '1116px',
          top: '750px',
          width: '655px',
          height: '35px',
        }"
      />

      <!-- Media Box -->
      <MediaBox
        vertical
        :font-size="25"
        :style="{
          left: '983px',
          top: '83px',
          width: '402px',
          height: '399px',
        }"
      />

      <DonationTotal
        no-background
        :style="{
          position: 'absolute',
          left: '1436px',
          top: '195px',
        }"
      />

      <!-- Upcoming Run -->
      <UpcomingRun
        :slot-no="0"
        class="Fixed"
        :run-data="intermissionStore.nextRuns[0]"
        :style="{
          left: '138px',
          top: '100px',
          width: '667px',
          height: '652px',
        }"
      />

      <!-- Rotation meer upcoming runs-->
      <Rotation
        :style="{
          left: '138px',
          top: '393px',
          width: '667px',
          height: '652px',
        }"
      />

      <!-- Donation Reader and Music Track -->
      <div
        class="Fixed Flex"
        :style="{
          left: '1110px',
          top: '802px',
          width: '672px',
          height: '60px',
          'justify-content': 'flex-start',
          'font-size': '30px',
        }"
      >
        <DonationReader />
      </div>
      <div class="musicContainer">
        <MusicTrack hide-icon class="music" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#Intermission {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.musicContainer {
  position: relative;
  width: 672px;
  height: 100px;
  left: 1110px;
  top: 950px;
  font-size: 20px;
  /*background: rgba(255, 255, 255, 0.5);*/
}

/*.music {
  position: absolute;
  font-size: 20px !important;
  top: 50px !important;
  left: 0;
  height: 60px;
}*/
</style>
