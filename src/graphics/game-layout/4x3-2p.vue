<template>
  <div class="bsglayout _4x3_2p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '958px',
        height: '715px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '963px',
      top: '0px',
      width: '958px',
      height: '715px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '720px',
      top: '828px',
      width: '480px',
      height: '170px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '728px',
      width: '710px',
      height: '45px'
      }"
    >
      <player :slot-no="0"/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '728px',
        width: '710px',
        height: '45px'
      }"
    >
      <player :slot-no="1"/>
    </div>

    <!-- Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '715px',
          top: '728px',
          width: '490px',
          height: '94px',
        }"
    >
      <timer line-right line-left />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '778px',
        width: '710px',
        height: '220px',
      }"
    >
      <run-info-canvas :width="710" :height="220" text-align="left" line-right/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn"
         :style="{
          left: '0px',
          top: '778px',
          width: '710px',
          height: '221px',
        }"
    >
      <flashing-lights-warning
        class="Flex"
        style="align-self: flex-end"/>
      <media-box-box
        line-left
        :style="{
          width: '710px',
          height: '100%',
        }"
      />
      <commentators-reader line-top />
      <commentators-reader line-top show-reader/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfoCanvas from './components/RunInfoCanvas.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfoCanvas,
    Timer,
    MediaBox,
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
  //
}
</script>
