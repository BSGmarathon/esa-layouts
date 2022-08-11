<template>
<div :style="{ 'backgroundImage': `url(bsgbacks/standard_2_bg.png)`,
'background-repeat': 'no-repeat'}
">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '955px',
        height: '716px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
      left: '964px',
      top: '0px',
      width: '955px',
      height: '716px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 2 camera spots. -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '724px',
      top: '834px',
      width: '472px',
      height: '166px',
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
      class="Fixed BlockGreen"
      :style="{
      left: '189px',
      top: '748px',
      width: '520px',
      height: '85px'
      }"
    >
      <player :slot-no="0" />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1209px',
        top: '733px',
        width: '520px',
        height: '85px'
      }"
    >
      <player :slot-no="1" />

      <!-- Run Game Info/Timer -->
      <div
      class="Fixed Flex BlockYellow"
      :style="{
        flex: '1',
        width: '100%',
        left: '1227px',
        top: '827px',
        width: '534px',
        height: '170px',
        }"
      >
        <run-info :style="{ 'font-size': '35px' }" />
      </div>
      <div
  class="Fixed FlexColumn BlockBlack"
  :style="{
    flex: '1',
    width: '100%',
    left: '827px',
    top: '737px',
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
      top: '829px',
      width: '665px',
      height: '169px',
      }"
    />

    <div class="Fixed"
    :style="{
    width: '97%',
    left: '47px',
    top: '961px',
    width: '661px',
    height: '111px',
    }">
    <commentators-reader show-reader />
  </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import MediaBox from '@shared/graphics/mediabox';
import CommentatorsReader from './components/CommentatorsReader.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
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
