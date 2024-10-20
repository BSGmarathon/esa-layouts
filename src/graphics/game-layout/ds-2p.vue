<template>
  <div class="bsglayout _ds_2p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '659px',
        height: '497px',
      }"
    />
    <game-capture
      id="GameCapture3"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '502px',
        width: '659px',
        height: '496px',
      }"
    />
    <game-capture
      id="GameCapture2"
      finish-time-pos="bottomright"
      :slot-no="1"
      :style="{
        left: '1259px',
        top: '0px',
        width: '661px',
        height: '497px',
      }"
    />
    <game-capture
      id="GameCapture4"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1259px',
        top: '502px',
        width: '661px',
        height: '496px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '686px',
      top: '618px',
      width: '549px',
      height: '380px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed"
      :style="{
      left: '676px',
      top: '314px',
      width: '504px',
      height: '44px'
      }"
    >
      <player :slot-no="0"/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '737px',
      top: '453px',
      width: '507px',
      height: '44px'
      }"
    >
      <player :slot-no="1"/>
    </div>

    <!-- Run Game Info/Commentators/Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '676px',
        top: '0px',
        width: '568px',
        height: '309px',
      }"
    >
      <run-info line-right line-left/>
      <commentators-reader line-top show-reader/>
      <commentators-reader line-top/>
    </div>

    <!-- Run Game Info/Commentators/Reader -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '676px',
        top: '365px',
        width: '568px',
        height: '90px',
      }"
    >
      <flashing-lights-warning/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
          left: '676px',
          top: '502px',
          width: '568px',
          height: '101px',
        }"
    >
      <timer line-left line-right />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';
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
