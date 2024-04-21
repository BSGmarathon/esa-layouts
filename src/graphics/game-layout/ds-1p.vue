<template>
  <div class="bsglayout _ds_1p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :style="{
      left: '589px',
      top: '0px',
      width: '1331px',
      height: '998px',
      }"
    />
    <game-capture
      id="GameCapture3"
      :style="{
      left: '101px',
      top: '709px',
      width: '386px',
      height: '289px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '0px',
      top: '299px',
      width: '567px',
      height: '236px',
      }"
    >
      <flashing-lights-warning/>
    </div>

    <!-- Run Game Info / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '0px',
      width: '575px',
      height: '285px',
      }"
    >
      <run-info line-right line-left />
      <commentators-reader line-top show-reader/>
      <commentators-reader line-top />
    </div>

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '547px',
      width: '575px',
      height: '45px',
      }"
    >
      <player/>
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '597px',
        width: '575px',
        height: '101px',
      }"
    >
      <timer
        class="TimerFH"
        top-margin="5px"
        line-left
        line-right
        :line-bottom="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
