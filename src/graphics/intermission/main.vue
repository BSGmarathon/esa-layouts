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
      <commercial-timer
        :style="{
          left: '1116px',
          top: '750px',
          width: '655px',
          height: '35px',
        }"
      />

      <!-- Media Box -->
      <media-box
        vertical
        :font-size="25"
        :style="{
          left: '983px',
          top: '83px',
          width: '402px',
          height: '399px',
        }"
      />

      <donation-total
        no-background
        :style="{
          position: 'absolute',
          left: '1436px',
          top: '195px',
        }"
      />

      <!-- Upcoming Run -->
      <upcoming-run
        class="Fixed"
        :run-data="nextRuns[0]"
        :style="{
          left: '138px',
          top: '100px',
          width: '667px',
          height: '652px',
        }"
      />

      <!-- Rotation meer upcoming runs-->
      <rotation
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
        <donation-reader />
      </div>
      <div class="musicContainer">
        <music-track hide-icon class="music" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RunData } from 'speedcontrol-util/types';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
// import { generateClipPath } from '../_misc/cut-background';
import MediaBox from '@shared/graphics/mediabox';
import UpcomingRun from './components/UpcomingRun.vue';
import Rotation from './components/Rotation.vue';
import { getZoomAmountCSS } from '../_misc/helpers';
import CommercialTimer from './components/CommercialTimer.vue';
import DonationReader from './components/DonationReader.vue';
import MusicTrack from './components/MusicTrack.vue';
import DonationTotal from './components/DonationTotal.vue';

@Component({
  components: {
    MediaBox,
    CommercialTimer,
    UpcomingRun,
    Rotation,
    DonationReader,
    MusicTrack,
    DonationTotal,
  },
})
export default class extends Vue {
  @State nextRuns!: RunData[];
  clipPath = 'unset';
  zoom = getZoomAmountCSS();

  mounted(): void {
    // Bring this back if we actually gain some cameras on this layout.
    // this.clipPath = generateClipPath();
  }
}
</script>

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
