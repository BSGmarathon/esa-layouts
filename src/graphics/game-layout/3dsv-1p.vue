<template>
  <div class="bsglayout _3ds_1p_vertical">
    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0x',
      top: '0px',
      width: '574px',
      height: '252px',
      }"
    >
      <run-info />
    </div>

    <!-- Host/comms -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0x',
      top: '257px',
      width: '574px',
      height: '97px',
      }"
    >
      <commentators-reader show-reader />
      <commentators-reader />
    </div>

    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      :style="{
      left: '846px',
      top: '0px',
      width: '808px',
      height: '486px',
      }"
    />

    <game-capture
      id="GameCapture3"
      :style="{
      left: '928px',
      top: '513px',
      width: '646px',
      height: '485px',
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
    />

    <!-- Player -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '683px',
      width: '574px',
      height: '44px',
      }"
    >
      <player/>
    </div>

    <!--TIMER-->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '732px',
        width: '574px',
        height: '101px',
      }"
    >
      <timer line-right/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '825px',
        width: '574px',
        height: '176px',
      }"
    >
      <flashing-lights-warning class="Flex" style="align-self: flex-end" />
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
import MediaBoxBox from './components/MediaBoxBox.vue';
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
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
