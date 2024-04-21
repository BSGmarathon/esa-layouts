<template>
  <div class="bsglayout _16x9_2p_connected">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
      left: '0px',
      top: '77px',
      width: '715px',
      height: '536px',
      }"
    />

    <!-- Something for the tracker -->
    <game-capture
      id="GameCapture3"
      :slot-no="2"
      :style="{
      left: '715px',
      top: '77px',
      width: '491px',
      height: '536px',
      }"
    />

    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '1206px',
      top: '77px',
      width: '715px',
      height: '536px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '696px',
      top: '742px',
      width: '529px',
      height: '256px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '627px',
      width: '682px',
      height: '44px'
      }"
    >
      <player :slot-no="0" />
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1238px',
      top: '627px',
      width: '682px',
      height: '44px'
      }"
    >
      <player :slot-no="1" />
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
          left: '687px',
          top: '627px',
          width: '546px',
          height: '101px',
        }"
    >
      <timer line-left line-right />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1238px',
        top: '676px',
        width: '682px',
        height: '322px',
        }"
    >
      <flashing-lights-warning class="Flex" style="align-self: flex-end" />
      <run-info line-right />
    </div>

    <!-- Media Box / Reader / Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
          left: '0px',
          top: '676px',
          width: '682px',
          height: '322px',
        }"
    >
      <media-box-box
        line-right
        :style="{
          width: '682px',
          height: '100%',
        }"
      />
      <commentators-reader line-top show-reader />
      <commentators-reader line-top />
    </div>

  </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    MediaBoxBox,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
