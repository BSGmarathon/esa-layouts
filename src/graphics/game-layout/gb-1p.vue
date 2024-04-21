<template>
<div class="bsglayout _gb_1p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :style="{
        left: '700px',
        top: '0px',
        width: '1108px',
        height: '1000px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '336px',
        width: '576px',
        height: '347px',
    }"/>

  <!-- Run Game Info -->
  <div
    class="Flex FlexColumn"
    :style="{
        left: '0px',
        top: '0px',
        width: '576px',
        height: '281px',
        'justify-content': 'space-between',
    }"
  >
    <run-info line-right />
    <flashing-lights-warning class="Flex" style="align-self: flex-end" />
  </div>

  <div
    class="Fixed FlexColumn"
    :style="{
    left: '0px',
    top: '286px',
    width: '575px',
    height: '44px',
    }"
  >
    <player />
  </div>

    <!--host, comms, timer, and mediabox-->
    <div
      class="Fixed FlexColumn"
      :style="{
        flex: '1',
        left: '0px',
        top: '688px',
        width: '575px',
        // height: '322px',
        height: '310px',
      }"
    >
      <commentators-reader />
      <commentators-reader show-reader />
      <timer line-right />
      <media-box-box
        line-right
        :style="{
          width: '575px',
          // height: '109px',
          // height: '118px',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
