<template>
<div id="Intermission" :style="{
  'background-image': 'url(bsgbacks/break_bg_edited.png)',
'background-repeat': 'no-repeat'}
">
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
          top: '993px',
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
        class="Fixed FlexI"
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
        <!--<music-track />-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunData } from 'speedcontrol-util/types';
// import { generateClipPath } from '../_misc/cut-background';
import MediaBox from '@shared/graphics/mediabox';
import CommercialTimer from './components/CommercialTimer.vue';
import UpcomingRun from './components/UpcomingRun.vue';
import Rotation from './components/Rotation.vue';
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

  mounted(): void {
    // Bring this back if we actually gain some cameras on this layout.
    // this.clipPath = generateClipPath();
  }
}
</script>

<style scoped>
#Intermission {
  background-color: gray !important;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
