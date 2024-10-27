<template>
  <div class="bsglayout _ds_1p_vertical">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :style="{
      left: '932px',
      top: '0px',
      width: '647px',
      height: '487px'
      }"
    />
    <game-capture
      id="GameCapture3"
      :style="{
      left: '932px',
      top: '513px',
      width: '647px',
      height: '485px'
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '0px',
      top: '363px',
      width: '566px',
      height: '307px',
      }"
    >
      <flashing-lights-warning />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '0px',
      width: '574px',
      height: '349px'
      }"
    >
      <run-info line-right />
      <commentators-reader line-top show-reader/>
      <commentators-reader line-top/>
    </div>

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '683px',
      width: '574px',
      height: '44px'
      }"
    >
      <player/>
    </div>

    <!-- Media Box / Timer -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '732px',
        width: '574px',
        height: '266px',
      }"
    >
      <timer line-right />
      <media-box-box
        line-right
        :style="{
          width: '574px',
          height: '100%',
        }"
      />
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
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
