<template>
  <div class="bsglayout _gba_2p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
      left: '0px',
      top: '0px',
      width: '958px',
      height: '637px',
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
      height: '637px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '721px',
      top: '750px',
      width: '477px',
      height: '248px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '0px',
      top: '650px',
      width: '710px',
      height: '45px'
      }"
    >
      <player :slot-no="0"/>
    </div>

    <div
      class="Fixed FlexColumn"
      :style="{
      flex: '1',
      left: '715px',
      top: '650px',
      width: '490px',
      height: '96px',
    }"
    >
      <timer line-left line-right/>
    </div>

    <!-- Player 2 -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1210px',
      top: '650px',
      width: '710px',
      height: '45px'
      }"
    >
      <player :slot-no="1"/>
    </div>

    <!-- Run Game Info/warning -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '700px',
        width: '710px',
        height: '298px',
        }"
    >
      <run-info line-right />
      <flashing-lights-warning
        class="Flex"
        style="align-self: flex-end"/>
    </div>

    <!-- Media box / commentator / donation reader -->
    <div class="Fixed FlexColumn"
         :style="{
        left: '0px',
        top: '700px',
        width: '710px',
        height: '298px',
        }"
    >
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
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import MediaBoxBox from './components/MediaBoxBox.vue';
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
  //
}
</script>
