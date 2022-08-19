<template>
  <div class="bsglayout _16x9_2p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
      left: '0px',
      top: '74px',
      width: '955px',
      height: '540px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '963px',
      top: '74px',
      width: '957px',
      height: '540px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 2 camera spots -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '724px',
      top: '732px',
      width: '470px',
      height: '268px',
      }"
    >
      <flashing-lights-warning/>
    </div>
    <template v-else>
      <div
        id="CameraCapture1"
        class="Capture"
        :style="{
          left: '711px',
          top: '720px',
          width: '249px',
          height: '280px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture"
        :style="{
          left: '960px',
          top: '720px',
          width: '249px',
          height: '280px',
        }"
      />
    </template>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
      left: '189px',
      top: '648px',
      width: '520px',
      height: '85px'
      }"
    >
      <player :slot-no="0" />
      <!--<commentators-reader />
      <commentators-reader show-reader />-->
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1209px',
      top: '632px',
      width: '520px',
      height: '85px'
      }"
    >
      <player :slot-no="1" />

      <!-- Run Game Info/Timer -->
      <div
        class="Fixed FlexColumn BlockYellow"
        :style="{
        flex: '1',
        width: '100%',
        left: '1227px',
        top: '727px',
        width: '545px',
        height: '270px',
        }"
      >
        <run-info :style="{ 'font-size': '35px' }" />
        <div class="sub_div">
          <commentators-reader />
          <commentators-reader show-reader />
        </div>
      </div>
      <div
        class="Fixed FlexColumn BlockBlack"
        :style="{
    flex: '1',
    width: '100%',
    left: '821px',
    top: '636px',
    width: '412px',
    height: '75px',
  }"
      >
        <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="20"
      :style="{
      left: '43px',
      top: '729px',
      width: '665px',
      height: '269px',
      }"
    />

  </div>
</template>

<script lang="ts">
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
