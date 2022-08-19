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
      width: '956px',
      height: '638px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '964px',
      top: '0px',
      width: '956px',
      height: '638px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 2 camera spots -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture"
      :style="{
      left: '724px',
      top: '757px',
      width: '472px',
      height: '240px',
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
      top: '672px',
      width: '520px',
      height: '85px'
      }"
    >
      <player :slot-no="0" />
      <!--<comm-and-reader />-->
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
      left: '1209px',
      top: '652px',
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
        top: '746px',
        width: '534px',
        height: '270px',
        }"
      >
        <run-info :style="{ 'font-size': '35px' }" />
      </div>

      <div class="Fixed"
      :style="{
      width: '97%',
      left: '1229px',
      top: '957px',
      width: '534px',
      height: '111px',
      }">
      <commentators-reader />
    </div>
    <div class="Fixed"
    :style="{
    width: '97%',
    left: '18px',
    top: '957px',
    width: '685px',
    height: '111px',
    }">
    <commentators-reader show-reader />
  </div>

      <div
  class="Fixed FlexColumn BlockBlack"
  :style="{
    flex: '1',
    width: '100%',
    left: '823px',
    top: '658px',
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
      left: '41px',
      top: '750px',
      width: '668px',
      height: '248px',
      }"
    />

    <!-- Donation Bar -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
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
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
